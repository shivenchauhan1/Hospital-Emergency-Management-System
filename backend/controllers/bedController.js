const Bed = require('../models/Bed');
const EmergencyCase = require('../models/EmergencyCase');
const BedAllocator = require('../dsa/BedAllocator');

// Global Singleton BedAllocator Instance
const bedAllocatorInstance = new BedAllocator();

module.exports = (io) => {
  return {
    bedAllocatorInstance,

    // GET /api/beds
    getBeds: async (req, res) => {
      try {
        const beds = await Bed.find();
        res.json({ success: true, count: beds.length, data: beds });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // POST /api/beds/allocate
    allocateBed: async (req, res) => {
      try {
        const { category = 'General', priority = 'Medium', caseId } = req.body;

        // 1. POP BED FROM DSA FREE-LIST STACK
        const result = bedAllocatorInstance.allocate(category, priority);

        if (!result || !result.bed) {
          return res.status(400).json({
            success: false,
            message: `No available beds in ${category} category or fallback chain.`
          });
        }

        const allocatedBed = result.bed;

        // 2. DB-FIRST WRITE: Update Bed status in MongoDB
        await Bed.findOneAndUpdate(
          { $or: [{ id: allocatedBed.id }, { bedNumber: allocatedBed.bedNumber }] },
          { status: 'Occupied' },
          { new: true }
        );

        // Update EmergencyCase if caseId provided
        if (caseId) {
          await EmergencyCase.findOneAndUpdate(
            { id: caseId },
            { bedAllocated: allocatedBed.bedNumber, status: 'Treatment Started' }
          );
        }

        // 3. BROADCAST SOCKET EVENT
        if (io) {
          io.emit('bed_allocated', { bed: allocatedBed, caseId });
        }

        res.json({
          success: true,
          message: `Allocated ${allocatedBed.bedNumber} (${result.allocatedCategory}${result.fallbackUsed ? ' via Critical Fallback' : ''})`,
          data: {
            bedNumber: allocatedBed.bedNumber,
            type: allocatedBed.type,
            allocatedCategory: result.allocatedCategory,
            fallbackUsed: result.fallbackUsed
          }
        });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // POST /api/beds/release
    releaseBed: async (req, res) => {
      try {
        const { bedId } = req.body;

        if (!bedId) {
          return res.status(400).json({ success: false, message: 'bedId is required' });
        }

        // 1. PUSH BED BACK TO DSA FREE-LIST STACK
        bedAllocatorInstance.release(bedId);

        // 2. DB-FIRST WRITE: Update Bed status in MongoDB
        const updatedBed = await Bed.findOneAndUpdate(
          { $or: [{ id: bedId }, { bedNumber: bedId }] },
          { status: 'Available' },
          { new: true }
        );

        // 3. BROADCAST SOCKET EVENT
        if (io) {
          io.emit('bed_released', { bedId });
        }

        res.json({
          success: true,
          message: `Bed ${bedId} released back to free-list stack`,
          data: updatedBed
        });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  };
};

module.exports.bedAllocatorInstance = bedAllocatorInstance;
