const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');
const { BloodCompatibilityEngine } = require('../dsa/UnionFind');

const bloodEngine = new BloodCompatibilityEngine();

exports.getBloodStock = async (req, res) => {
  try {
    const blood = await BloodInventory.find();
    res.json({ success: true, count: blood.length, data: blood });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/blood/compatible/:group
 * Returns compatible blood groups using Union-Find Disjoint-Set Structure
 */
exports.getCompatibleStock = async (req, res) => {
  try {
    const { group } = req.params;

    // 1. RUN UNION-FIND COMPATIBILITY LOOKUP
    const compatibleGroups = bloodEngine.getCompatibleDonorGroups(group);

    // 2. QUERY BLOOD INVENTORY FOR COMPATIBLE GROUPS WITH UNITS > 0
    const inventory = await BloodInventory.find({
      group: { $in: compatibleGroups },
      units: { $gt: 0 }
    });

    const totalAvailableUnits = inventory.reduce((sum, item) => sum + item.units, 0);

    res.json({
      success: true,
      requestedGroup: group,
      compatibleGroups,
      totalAvailableUnits,
      data: inventory
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/blood/request
 */
exports.requestBlood = async (req, res) => {
  try {
    const { patientName = 'Emergency Patient', bloodGroup = 'O+', units = 2, hospital } = req.body;
    const count = await BloodRequest.countDocuments();
    const requestId = `BR2026${String(count + 1).padStart(4, '0')}`;

    const newRequest = await BloodRequest.create({
      requestId,
      patientName,
      bloodGroup,
      units,
      hospital: hospital || 'Sanjeevani Multispeciality Hospital',
      status: 'Pending'
    });

    const compatibleGroups = bloodEngine.getCompatibleDonorGroups(bloodGroup);
    const compatibleStock = await BloodInventory.find({
      group: { $in: compatibleGroups },
      units: { $gt: 0 }
    });

    res.status(201).json({
      success: true,
      message: `Blood Request Submitted for ${bloodGroup}`,
      data: {
        request: newRequest,
        compatibleGroups,
        compatibleStock
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
