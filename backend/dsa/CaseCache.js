/**
 * CaseCache.js - O(1) Hash Map Cache for Emergency Case Lookups
 * 
 * Strict Ordering Rule for DB/Cache Consistency:
 * Always write to MongoDB FIRST. Only after MongoDB operation succeeds, update the CaseCache.
 * This guarantees that if a DB write throws an error or fails, the cache will never contain
 * divergent/stale state.
 * 
 * Tradeoff & Known Limitation:
 * Process-local memory cache assuming single-instance server deployment.
 * In a multi-node horizontally scaled environment, an external distributed cache like Redis
 * or cache invalidation pub/sub would be required.
 */

class CaseCache {
  constructor() {
    this.cache = new Map();
  }

  set(id, caseObject) {
    if (!id || !caseObject) return;
    this.cache.set(String(id), caseObject);
  }

  get(id) {
    return this.cache.get(String(id)) || null;
  }

  delete(id) {
    return this.cache.delete(String(id));
  }

  has(id) {
    return this.cache.has(String(id));
  }

  values() {
    return Array.from(this.cache.values());
  }

  size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }

  /**
   * Hydrates cache from MongoDB initial query on server startup
   */
  hydrate(casesList) {
    this.clear();
    if (Array.isArray(casesList)) {
      casesList.forEach((c) => {
        if (c.id) {
          this.set(c.id, c);
        }
      });
    }
  }
}

// Export a singleton instance
module.exports = new CaseCache();
