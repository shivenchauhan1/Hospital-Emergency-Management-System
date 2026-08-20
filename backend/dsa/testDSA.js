/**
 * testDSA.js - Automated Test Script for all 6 Backend DSA Classes
 * Run using: node backend/dsa/testDSA.js
 */

const assert = require('assert');
const PriorityQueue = require('./PriorityQueue');
const { Graph, createHospitalZoneGraph } = require('./Graph');
const CaseCache = require('./CaseCache');
const BedAllocator = require('./BedAllocator');
const LRUCache = require('./LRUCache');
const { UnionFind, BloodCompatibilityEngine } = require('./UnionFind');

console.log('🧪 Starting Automated DSA Unit Tests...\n');

// 1. Priority Queue Unit Tests
console.log('1️⃣ Testing PriorityQueue (Binary Min-Heap & FIFO Triage)...');
const pq = new PriorityQueue();
const t1 = new Date('2026-08-20T10:00:00Z');
const t2 = new Date('2026-08-20T10:05:00Z');
const t3 = new Date('2026-08-20T10:10:00Z');

pq.insert({ id: 'C1', priority: 'Medium', createdAt: t1 });
pq.insert({ id: 'C2', priority: 'Critical', createdAt: t3 }); // Later Critical
pq.insert({ id: 'C3', priority: 'High', createdAt: t2 });
pq.insert({ id: 'C4', priority: 'Critical', createdAt: t1 }); // Earlier Critical

const triageArray = pq.toArray();
assert.strictEqual(triageArray[0].id, 'C4', 'Earlier Critical must rank 1st');
assert.strictEqual(triageArray[1].id, 'C2', 'Later Critical must rank 2nd');
assert.strictEqual(triageArray[2].id, 'C3', 'High priority must rank 3rd');
assert.strictEqual(triageArray[3].id, 'C1', 'Medium priority must rank 4th');
assert.strictEqual(pq.size(), 4, 'toArray() must preserve original heap size');
console.log('   ✅ PriorityQueue tests passed!');

// 2. Graph & Dijkstra Unit Tests
console.log('2️⃣ Testing Graph & Dijkstra Shortest Path...');
const graph = createHospitalZoneGraph();
const { distances } = graph.dijkstra('Sector 32');
assert.strictEqual(distances['Sector 32'], 0, 'Distance to self must be 0');
assert.strictEqual(distances['Tribune Chowk'], 2.5, 'Distance Sector 32 -> Tribune Chowk must be 2.5');
assert.strictEqual(distances['Panchkula'], 8.5, 'Distance Sector 32 -> Tribune Chowk -> Panchkula must be 8.5');

const resolvedZone = graph.resolveZone('Near PGI Medical Gate 2');
assert.strictEqual(resolvedZone, 'PGI', 'Address resolution to PGI node failed');
console.log('   ✅ Graph & Dijkstra tests passed!');

// 3. Case Cache Unit Tests
console.log('3️⃣ Testing CaseCache Map Wrapper...');
CaseCache.set('ER001', { id: 'ER001', priority: 'Critical' });
assert.strictEqual(CaseCache.has('ER001'), true, 'CaseCache.has failed');
assert.strictEqual(CaseCache.get('ER001').priority, 'Critical', 'CaseCache.get failed');
CaseCache.delete('ER001');
assert.strictEqual(CaseCache.has('ER001'), false, 'CaseCache.delete failed');
console.log('   ✅ CaseCache tests passed!');

// 4. Bed Allocator Unit Tests
console.log('4️⃣ Testing BedAllocator (Free-Lists & Fallback Chain)...');
const bedAlloc = new BedAllocator();
bedAlloc.hydrate([
  { id: 'BED-1', type: 'ICU', status: 'Available' },
  { id: 'BED-2', type: 'General', status: 'Available' }
]);

const alloc1 = bedAlloc.allocate('General', 'Medium');
assert.strictEqual(alloc1.bed.id, 'BED-2', 'General bed allocation failed');

// Request ICU when none free but priority Critical -> Greedy Fallback to ICU
const alloc2 = bedAlloc.allocate('EmergencyBay', 'Critical');
assert.strictEqual(alloc2.bed.id, 'BED-1', 'Critical fallback allocation to ICU failed');
assert.strictEqual(alloc2.fallbackUsed, true, 'fallbackUsed flag must be true');

bedAlloc.release('BED-1');
assert.strictEqual(bedAlloc.getFreeCounts().ICU, 1, 'Releasing BED-1 back to ICU free-list failed');
console.log('   ✅ BedAllocator tests passed!');

// 5. LRU Cache Unit Tests
console.log('5️⃣ Testing LRUCache (Doubly Linked List + Map, Capacity 3)...');
const lru = new LRUCache(3);
lru.put('R1', 'Report 1');
lru.put('R2', 'Report 2');
lru.put('R3', 'Report 3');

assert.strictEqual(lru.get('R1'), 'Report 1', 'R1 get failed');
lru.put('R4', 'Report 4'); // Evicts R2 because R1 was recently accessed!

assert.strictEqual(lru.get('R2'), null, 'R2 should have been evicted');
assert.strictEqual(lru.get('R3'), 'Report 3', 'R3 should exist');
assert.strictEqual(lru.get('R4'), 'Report 4', 'R4 should exist');
console.log('   ✅ LRUCache tests passed!');

// 6. Union-Find Unit Tests
console.log('6️⃣ Testing UnionFind & Blood Compatibility Engine...');
const bloodEngine = new BloodCompatibilityEngine();
const abPlusDonors = bloodEngine.getCompatibleDonorGroups('AB+');
assert.strictEqual(abPlusDonors.length, 8, 'AB+ must accept all 8 blood groups (Universal Recipient)');

const oNegDonors = bloodEngine.getCompatibleDonorGroups('O-');
assert.deepStrictEqual(oNegDonors, ['O-'], 'O- recipient can only receive from O-');
console.log('   ✅ UnionFind & Blood Compatibility tests passed!\n');

console.log('🎉 ALL 6 CUSTOM DSA DATA STRUCTURE TESTS PASSED SUCCESSFULLY! 🚀');
