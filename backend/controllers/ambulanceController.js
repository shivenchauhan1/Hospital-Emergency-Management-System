const Ambulance = require('../models/Ambulance');
const EmergencyCase = require('../models/EmergencyCase');
const { createHospitalZoneGraph } = require('../dsa/Graph');

const hospitalGraph = createHospitalZoneGraph();

exports.getAmbulances = async (req, res) => {
  try {
    const ambulances = await Ambulance.find();
    res.json({ success: true, count: ambulances.length, data: ambulances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/ambulances/reset
 * Resets all dispatched/on-route ambulances back to Available status
 * Used to restore dispatch capability after all units become occupied
 */
exports.resetAmbulances = async (req, res) => {
  try {
    const result = await Ambulance.updateMany(
      { status: { $in: ['Dispatched', 'On Route'] } },
      { $set: { status: 'Available', eta: '5 Mins' } }
    );
    const ambulances = await Ambulance.find();
    res.json({
      success: true,
      message: `Reset ${result.modifiedCount} ambulance(s) to Available status`,
      data: ambulances
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



/**
 * POST /api/ambulances/dispatch
 * Automates 108 Ambulance Dispatch using Graph + Dijkstra Shortest Path
 */
exports.dispatchNearestAmbulance = async (req, res) => {
  try {
    const { caseId, address } = req.body;

    let targetAddress = address;

    // Fetch address from EmergencyCase if caseId provided
    if (caseId && !targetAddress) {
      const emergencyCase = await EmergencyCase.findOne({ id: caseId });
      if (emergencyCase && emergencyCase.address) {
        targetAddress = emergencyCase.address;
      }
    }

    if (!targetAddress) {
      targetAddress = 'Sector 32, Chandigarh';
    }

    // 1. Resolve case address to nearest graph zone node
    const destinationZone = hospitalGraph.resolveZone(targetAddress);

    // 2. Run Dijkstra from destination zone
    const { distances } = hospitalGraph.dijkstra(destinationZone);

    // 3. Filter available ambulances from MongoDB
    const availableAmbulances = await Ambulance.find({ status: 'Available' });

    if (!availableAmbulances || availableAmbulances.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No 108 Ambulances currently available in dispatch network'
      });
    }

    // 4. Find available ambulance with shortest computed road distance
    let bestAmbulance = null;
    let shortestDistance = Infinity;

    availableAmbulances.forEach((amb) => {
      // Gracefully fallback to 'Sector 32' if zone is missing or unmapped
      const ambZone = amb.zone && hospitalGraph.nodes.has(amb.zone)
        ? amb.zone
        : hospitalGraph.resolveZone(amb.location);

      const dist = distances[ambZone] !== undefined ? distances[ambZone] : Infinity;

      if (dist < shortestDistance) {
        shortestDistance = dist;
        bestAmbulance = amb;
      }
    });

    if (!bestAmbulance) {
      // Fallback to first available if distance evaluation returned infinity
      bestAmbulance = availableAmbulances[0];
      shortestDistance = 5; // Default 5 km
    }

    // Calculate realistic ETA (2 mins per km, min 2 mins)
    const computedEtaMins = Math.max(2, Math.round(shortestDistance * 2));
    const etaString = `${computedEtaMins} Mins (${shortestDistance.toFixed(1)} km away)`;

    // 5. Update ambulance status in MongoDB
    bestAmbulance.status = 'Dispatched';
    bestAmbulance.eta = etaString;
    await bestAmbulance.save();

    // If caseId provided, update emergency case record
    if (caseId) {
      await EmergencyCase.findOneAndUpdate(
        { id: caseId },
        { ambulanceDispatched: bestAmbulance.number, status: 'Ambulance Dispatched' }
      );
    }

    res.json({
      success: true,
      message: `Ambulance ${bestAmbulance.number} dispatched via Dijkstra shortest path (${shortestDistance.toFixed(1)} km)`,
      data: {
        ambulance: bestAmbulance,
        destinationZone,
        distanceKm: shortestDistance,
        eta: etaString
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
