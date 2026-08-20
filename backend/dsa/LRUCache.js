/**
 * LRUCache.js - Least Recently Used Cache using Doubly-Linked List + Hash Map
 * 
 * Used for caching recently viewed patient diagnostic reports/scans.
 * Fast O(1) get and put operations with eviction of least-recently-used entries on capacity overflow.
 */

class DoublyLinkedListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity = 20) {
    this.capacity = capacity;
    this.map = new Map(); // key -> DoublyLinkedListNode
    
    // Dummy Head (MRU) & Dummy Tail (LRU)
    this.head = new DoublyLinkedListNode(null, null);
    this.tail = new DoublyLinkedListNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addNodeToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _moveToHead(node) {
    this._removeNode(node);
    this._addNodeToHead(node);
  }

  _popTail() {
    const lru = this.tail.prev;
    this._removeNode(lru);
    return lru;
  }

  get(key) {
    const stringKey = String(key);
    if (!this.map.has(stringKey)) {
      console.log(`[LRU CACHE MISS] Key: ${stringKey}`);
      return null;
    }

    const node = this.map.get(stringKey);
    this._moveToHead(node);
    console.log(`[LRU CACHE HIT] Key: ${stringKey}`);
    return node.value;
  }

  put(key, value) {
    const stringKey = String(key);

    if (this.map.has(stringKey)) {
      const node = this.map.get(stringKey);
      node.value = value;
      this._moveToHead(node);
    } else {
      const newNode = new DoublyLinkedListNode(stringKey, value);
      this.map.set(stringKey, newNode);
      this._addNodeToHead(newNode);

      if (this.map.size > this.capacity) {
        const evicted = this._popTail();
        this.map.delete(evicted.key);
        console.log(`[LRU CACHE EVICT] Evicted key ${evicted.key} due to capacity limit (${this.capacity})`);
      }
    }
  }

  size() {
    return this.map.size;
  }
}

module.exports = LRUCache;
