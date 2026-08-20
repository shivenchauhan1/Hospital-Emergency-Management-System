const EmergencyCase = require('../models/EmergencyCase');
const CaseCache = require('../dsa/CaseCache');
const PriorityQueue = require('../dsa/PriorityQueue');

/**
 * Helper to build and return the live-ranked Priority Queue array for pending cases
 * 
 * TRIAGE BUG FIX EXPLANATION:
 * Previously, cases were fetched using `EmergencyCase.find().sort({ createdAt: -1 })`.
 * This created a critical bug where a Medium-priority case arriving at 10:00 AM would rank
 * ABOVE a Critical-priority case arriving at 10:05 AM simply because it had an earlier createdAt.
 * Using a Binary Min-Heap Priority Queue ranks Critical > High > Medium, using arrival timestamp
 * strictly as a FIFO tiebreaker for cases with identical priority ranks.
 */
function getRankedPendingQueue() {
  // Read from CaseCache first, fallback to empty array
  let cases = CaseCache.values();
  if (!cases || cases.length === 0) {
    return [];
  }

  const pendingCases = cases.filter(c => c.status === 'Pending');
  const pq = new PriorityQueue();
  pendingCases.forEach(item => pq.insert(item));
  return pq.toArray();
}

module.exports = (io) => {
  const broadcastQueueUpdate = () => {
    if (io) {
      const liveQueue = getRankedPendingQueue();
      io.emit('queue_updated', liveQueue);
    }
  };

  return {
    // GET /api/emergency
    getEmergencies: async (req, res) => {
      try {
        let cases = CaseCache.values();
        if (!cases || cases.length === 0) {
          // Cache miss / fallback to MongoDB
          cases = await EmergencyCase.find().sort({ createdAt: -1 });
          CaseCache.hydrate(cases);
        }
        res.json({ success: true, count: cases.length, data: cases });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // GET /api/emergency/queue - Staff Portal Emergency Queue Console
    getEmergencyQueue: async (req, res) => {
      try {
        let rankedQueue = getRankedPendingQueue();
        if (rankedQueue.length === 0) {
          // Fallback to MongoDB if cache is empty
          const pendingFromDB = await EmergencyCase.find({ status: 'Pending' });
          const pq = new PriorityQueue();
          pendingFromDB.forEach(c => pq.insert(c));
          rankedQueue = pq.toArray();
        }
        res.json({ success: true, count: rankedQueue.length, data: rankedQueue });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // POST /api/emergency
    createEmergency: async (req, res) => {
      try {
        const count = await EmergencyCase.countDocuments();
        const emergencyId = `ER2026${String(count + 1).padStart(4, '0')}`;
        
        // 1. STRICT DB-FIRST WRITE
        const newCase = await EmergencyCase.create({
          id: emergencyId,
          patientName: req.body.patientName || 'Anonymous Patient',
          age: req.body.age || '30',
          gender: req.body.gender || 'Male',
          phone: req.body.phone || '+91 98765 00000',
          emergencyType: req.body.emergencyType || 'General Emergency',
          priority: req.body.priority || 'Critical',
          status: 'Pending',
          assignedDoctor: 'Unassigned',
          ambulanceDispatched: 'None',
          address: req.body.address || 'Sector 32, Chandigarh',
          description: req.body.description || ''
        });

        // 2. IN-MEMORY CACHE UPDATE (Only after MongoDB write succeeds)
        CaseCache.set(newCase.id, newCase.toObject());

        // 3. BROADCAST SOCKET EVENTS
        if (io) {
          io.emit('new_emergency_request', newCase);
        }
        broadcastQueueUpdate();

        res.status(201).json({
          success: true,
          message: 'Emergency request submitted and broadcasted via Socket.IO',
          data: newCase
        });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/approve
    approveEmergency: async (req, res) => {
      try {
        const { id } = req.body;

        // 1. DB-FIRST WRITE
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { status: 'Approved' },
          { new: true }
        );

        if (!updatedCase) {
          return res.status(404).json({ success: false, message: 'Emergency case not found' });
        }

        // 2. CACHE UPDATE
        CaseCache.set(updatedCase.id, updatedCase.toObject());

        // 3. SOCKET BROADCAST
        if (io) {
          io.emit('case_updated', updatedCase);
        }
        broadcastQueueUpdate();

        res.json({ success: true, message: 'Case Approved', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/reject
    rejectEmergency: async (req, res) => {
      try {
        const { id } = req.body;

        // 1. DB-FIRST WRITE
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { status: 'Rejected' },
          { new: true }
        );

        if (!updatedCase) {
          return res.status(404).json({ success: false, message: 'Emergency case not found' });
        }

        // 2. CACHE UPDATE
        CaseCache.set(updatedCase.id, updatedCase.toObject());

        // 3. SOCKET BROADCAST
        if (io) {
          io.emit('case_updated', updatedCase);
        }
        broadcastQueueUpdate();

        res.json({ success: true, message: 'Case Rejected', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/assignDoctor
    assignDoctor: async (req, res) => {
      try {
        const { id, doctorName } = req.body;

        // 1. DB-FIRST WRITE
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { assignedDoctor: doctorName || 'Dr. Rajesh Sharma', status: 'Doctor Assigned' },
          { new: true }
        );

        if (!updatedCase) {
          return res.status(404).json({ success: false, message: 'Emergency case not found' });
        }

        // 2. CACHE UPDATE
        CaseCache.set(updatedCase.id, updatedCase.toObject());

        // 3. SOCKET BROADCAST
        if (io) {
          io.emit('doctor_assigned', updatedCase);
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: 'Doctor Assigned', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/dispatchAmbulance
    dispatchAmbulance: async (req, res) => {
      try {
        const { id, ambulanceNumber } = req.body;

        // 1. DB-FIRST WRITE
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { ambulanceDispatched: ambulanceNumber || 'PB01AB1234', status: 'Ambulance Dispatched' },
          { new: true }
        );

        if (!updatedCase) {
          return res.status(404).json({ success: false, message: 'Emergency case not found' });
        }

        // 2. CACHE UPDATE
        CaseCache.set(updatedCase.id, updatedCase.toObject());

        // 3. SOCKET BROADCAST
        if (io) {
          io.emit('ambulance_dispatched', updatedCase);
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: 'Ambulance Dispatched', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/allocateBed - Delegates to BedAllocator Free-List Stack
    allocateBed: async (req, res) => {
      try {
        const { id, category = 'ICU', priority = 'Critical' } = req.body;
        let { bedNumber } = req.body;

        // If no bedNumber supplied, allocate via BedAllocator Free-List Stack
        if (!bedNumber) {
          const { bedAllocatorInstance } = require('./bedController');
          const result = bedAllocatorInstance.allocate(category, priority);
          if (result && result.bed) {
            bedNumber = result.bed.bedNumber;
          } else {
            bedNumber = 'Bed-ICU-01'; // Fallback
          }
        }

        // 1. DB-FIRST WRITE
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { bedAllocated: bedNumber, status: 'Treatment Started' },
          { new: true }
        );

        if (!updatedCase) {
          return res.status(404).json({ success: false, message: 'Emergency case not found' });
        }

        // 2. CACHE UPDATE
        CaseCache.set(updatedCase.id, updatedCase.toObject());

        // 3. SOCKET BROADCAST
        if (io) {
          io.emit('bed_allocated', updatedCase);
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: `Bed Allocated (${bedNumber}) via BedAllocator`, data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/requestBlood
    requestBlood: async (req, res) => {
      try {
        const { id, bloodGroup } = req.body;

        // 1. DB-FIRST WRITE
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { bloodRequested: bloodGroup || 'O+' },
          { new: true }
        );

        if (!updatedCase) {
          return res.status(404).json({ success: false, message: 'Emergency case not found' });
        }

        // 2. CACHE UPDATE
        CaseCache.set(updatedCase.id, updatedCase.toObject());

        // 3. SOCKET BROADCAST
        if (io) {
          io.emit('blood_request', updatedCase);
        }

        res.json({ success: true, message: 'Blood Requested', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/complete
    completeEmergency: async (req, res) => {
      try {
        const { id } = req.body;

        // 1. DB-FIRST WRITE
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { status: 'Completed' },
          { new: true }
        );

        if (!updatedCase) {
          return res.status(404).json({ success: false, message: 'Emergency case not found' });
        }

        // 2. CACHE UPDATE
        CaseCache.set(updatedCase.id, updatedCase.toObject());

        // 3. SOCKET BROADCAST
        if (io) {
          io.emit('case_completed', updatedCase);
          io.emit('case_updated', updatedCase);
        }
        broadcastQueueUpdate();

        res.json({ success: true, message: 'Case Completed', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  };
};
