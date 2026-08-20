/**
 * BedAllocator.js - Greedy Interval-Style Bed Allocation Engine using Free-List Stacks
 * 
 * Maintained Free-Lists per Bed Category (ICU, EmergencyBay, General).
 * Supports priority fallback for Critical patients (ICU -> EmergencyBay -> General).
 * 
 * Concurrency Note (Viva/Examiner Explanation):
 * Node.js runs on a single-threaded event loop. Synchronous calls to `allocate()` and `release()`
 * are inherently serialized within a single process instance, preventing double-allocation race conditions.
 * For horizontally-scaled multi-process deployments, database-level atomic locks (e.g. findOneAndUpdate)
 * would be required.
 */

class BedAllocator {
  constructor() {
    this.freeLists = {
      ICU: [],
      EmergencyBay: [],
      General: []
    };
    this.allocatedBeds = new Map(); // bedId -> bedObject
  }

  /**
   * Helper to normalize category strings from DB or requests
   */
  normalizeCategory(cat) {
    if (!cat) return 'General';
    const c = String(cat).trim();
    if (c.toLowerCase().includes('icu')) return 'ICU';
    if (c.toLowerCase().includes('emergency') || c.toLowerCase().includes('trauma')) return 'EmergencyBay';
    return 'General';
  }

  /**
   * Hydrates the free-lists from Bed database objects
   */
  hydrate(bedsList) {
    this.freeLists = {
      ICU: [],
      EmergencyBay: [],
      General: []
    };
    this.allocatedBeds.clear();

    if (!Array.isArray(bedsList)) return;

    bedsList.forEach((bed) => {
      const isAvailable = bed.status === 'Available' || bed.status === 'Free';
      const category = this.normalizeCategory(bed.type);

      if (isAvailable) {
        this.freeLists[category].push(bed);
      } else if (bed.status === 'Occupied' || bed.status === 'Reserved') {
        this.allocatedBeds.set(String(bed.id || bed.bedNumber), bed);
      }
    });
  }

  /**
   * Allocate a bed for a given category and patient priority.
   * If requested category is empty and priority is 'Critical', fallback to: ICU -> EmergencyBay -> General
   */
  allocate(category, priority = 'Medium') {
    const primaryCategory = this.normalizeCategory(category);

    // Try exact category match first
    if (this.freeLists[primaryCategory] && this.freeLists[primaryCategory].length > 0) {
      const bed = this.freeLists[primaryCategory].pop(); // Stack Pop
      bed.status = 'Occupied';
      this.allocatedBeds.set(String(bed.id || bed.bedNumber), bed);
      return { bed, fallbackUsed: false, allocatedCategory: primaryCategory };
    }

    // If Critical priority, execute greedy fallback order: ICU -> EmergencyBay -> General
    const isCritical = String(priority).toLowerCase() === 'critical';
    if (isCritical) {
      const fallbackChain = ['ICU', 'EmergencyBay', 'General'];
      for (const fallbackCat of fallbackChain) {
        if (fallbackCat !== primaryCategory && this.freeLists[fallbackCat].length > 0) {
          const bed = this.freeLists[fallbackCat].pop();
          bed.status = 'Occupied';
          this.allocatedBeds.set(String(bed.id || bed.bedNumber), bed);
          return { bed, fallbackUsed: true, allocatedCategory: fallbackCat };
        }
      }
    }

    return null; // No bed available
  }

  /**
   * Release an occupied bed back to its category free-list
   */
  release(bedId, bedObject = null) {
    if (!bedId) return false;

    let bed = this.allocatedBeds.get(String(bedId)) || bedObject;

    if (!bed) {
      // Create minimal bed placeholder if unknown
      bed = { id: bedId, bedNumber: bedId, type: 'General', status: 'Available' };
    }

    bed.status = 'Available';
    const category = this.normalizeCategory(bed.type);
    this.allocatedBeds.delete(String(bedId));
    this.freeLists[category].push(bed); // Stack Push
    return true;
  }

  getFreeCounts() {
    return {
      ICU: this.freeLists.ICU.length,
      EmergencyBay: this.freeLists.EmergencyBay.length,
      General: this.freeLists.General.length
    };
  }
}

module.exports = BedAllocator;
