/**
 * UnionFind.js - Disjoint-Set Data Structure with Path Compression & Union by Rank
 * 
 * Used for Blood Group Compatibility Grouping in Emergency Transfusions.
 */

class UnionFind {
  constructor() {
    this.parent = new Map();
    this.rank = new Map();
  }

  makeSet(element) {
    if (!this.parent.has(element)) {
      this.parent.set(element, element);
      this.rank.set(element, 0);
    }
  }

  /**
   * Find root with Path Compression
   */
  find(element) {
    if (!this.parent.has(element)) {
      this.makeSet(element);
      return element;
    }

    if (this.parent.get(element) !== element) {
      this.parent.set(element, this.find(this.parent.get(element)));
    }
    return this.parent.get(element);
  }

  /**
   * Union sets by Rank
   */
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX !== rootY) {
      const rankX = this.rank.get(rootX) || 0;
      const rankY = this.rank.get(rootY) || 0;

      if (rankX < rankY) {
        this.parent.set(rootX, rootY);
      } else if (rankX > rankY) {
        this.parent.set(rootY, rootX);
      } else {
        this.parent.set(rootY, rootX);
        this.rank.set(rootX, rankX + 1);
      }
      return true;
    }
    return false;
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

/**
 * Blood Compatibility Engine powered by Union-Find / Rules Matrix
 */
class BloodCompatibilityEngine {
  constructor() {
    this.allGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    this.uf = new UnionFind();
    this.allGroups.forEach(g => this.uf.makeSet(g));

    // Standard Blood Compatibility Map: Recipient Group -> Array of Compatible Donor Groups
    this.compatibilityMap = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
      'AB-': ['AB-', 'A-', 'B-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'] // Universal Donor
    };

    // Union O- with all groups as Universal Donor
    this.allGroups.forEach(g => {
      this.uf.union('O-', g);
    });
  }

  getCompatibleDonorGroups(recipientGroup) {
    const normalized = String(recipientGroup || 'O+').trim().toUpperCase();
    return this.compatibilityMap[normalized] || [normalized, 'O-'];
  }
}

module.exports = { UnionFind, BloodCompatibilityEngine };
