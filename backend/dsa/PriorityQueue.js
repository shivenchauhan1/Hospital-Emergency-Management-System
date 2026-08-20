/**
 * PriorityQueue.js - Binary Min-Heap Implementation for Emergency Triage Queue
 * 
 * Fixes Triage Bug:
 * Previously, cases were fetched using MongoDB `.sort({ createdAt: -1 })`.
 * This caused a Critical case arriving later to be ranked BELOW an earlier Medium-priority case.
 * The Priority Queue orders cases primarily by Severity Rank (Critical > High > Medium)
 * and uses arrival timestamp (createdAt) as a FIFO tiebreaker for identical priority ranks.
 */

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  /**
   * Helper to map text priority to numeric rank for Min-Heap comparison
   * Rank 1: Critical (Highest priority)
   * Rank 2: High
   * Rank 3: Medium (Lowest priority)
   */
  static getPriorityRank(priorityStr) {
    if (!priorityStr) fontRank = 3;
    const p = String(priorityStr).trim().toLowerCase();
    if (p === 'critical') return 1;
    if (p === 'high') return 2;
    return 3; // Default to Medium
  }

  /**
   * Compare two nodes in the heap.
   * Returns negative if nodeA has higher priority than nodeB.
   */
  static compare(nodeA, nodeB) {
    const rankA = PriorityQueue.getPriorityRank(nodeA.priority);
    const rankB = PriorityQueue.getPriorityRank(nodeB.priority);

    if (rankA !== rankB) {
      return rankA - rankB; // Lower rank number = Higher medical priority
    }

    // Tiebreaker: Earlier createdAt timestamp wins (FIFO)
    const timeA = new Date(nodeA.createdAt || nodeA.createdAtTimestamp || Date.now()).getTime();
    const timeB = new Date(nodeB.createdAt || nodeB.createdAtTimestamp || Date.now()).getTime();
    return timeA - timeB;
  }

  insert(item) {
    if (!item) return;
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  extractTop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._sinkDown(0);
    return top;
  }

  size() {
    return this.heap.length;
  }

  /**
   * Returns array of items in prioritized order without destroying the internal heap.
   */
  toArray() {
    const clone = new PriorityQueue();
    clone.heap = [...this.heap];
    const result = [];
    while (clone.size() > 0) {
      result.push(clone.extractTop());
    }
    return result;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (PriorityQueue.compare(this.heap[index], this.heap[parentIndex]) < 0) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  _sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < length && PriorityQueue.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }
      if (rightChild < length && PriorityQueue.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

module.exports = PriorityQueue;
