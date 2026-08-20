/**
 * Graph.js - Weighted Graph & Dijkstra's Algorithm for Ambulance Routing
 * 
 * Models hospital service zones in Chandigarh/PGI (Sector 32, Sector 17, Sector 22, PGI, Panchkula, etc.)
 * with realistic road distance weights. Calculates shortest path from emergency case location to available ambulances.
 */

class Graph {
  constructor() {
    this.nodes = new Map(); // id -> data { lat, lng, name }
    this.adjacencyList = new Map(); // id -> [{ node, weight }]
  }

  addNode(id, data = {}) {
    if (!id) return;
    this.nodes.set(id, { id, ...data });
    if (!this.adjacencyList.has(id)) {
      this.adjacencyList.set(id, []);
    }
  }

  addEdge(idA, idB, weight) {
    if (!this.adjacencyList.has(idA)) this.addNode(idA);
    if (!this.adjacencyList.has(idB)) this.addNode(idB);

    this.adjacencyList.get(idA).push({ node: idB, weight });
    this.adjacencyList.get(idB).push({ node: idA, weight }); // Undirected road graph
  }

  /**
   * Dijkstra's Algorithm for Single-Source Shortest Paths
   * Returns distances map and previous node map for path reconstruction
   */
  dijkstra(sourceId) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();

    this.nodes.forEach((_, nodeId) => {
      distances[nodeId] = Infinity;
      previous[nodeId] = null;
      unvisited.add(nodeId);
    });

    // If sourceId is unmapped or missing, fallback to hospital main hub 'Sector 32'
    const validSource = this.nodes.has(sourceId) ? sourceId : 'Sector 32';
    distances[validSource] = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let current = null;
      let smallestDist = Infinity;

      for (const nodeId of unvisited) {
        if (distances[nodeId] < smallestDist) {
          smallestDist = distances[nodeId];
          current = nodeId;
        }
      }

      if (current === null || smallestDist === Infinity) break;

      unvisited.delete(current);

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (unvisited.has(neighbor.node)) {
          const alt = distances[current] + neighbor.weight;
          if (alt < distances[neighbor.node]) {
            distances[neighbor.node] = alt;
            previous[neighbor.node] = current;
          }
        }
      }
    }

    return { distances, previous };
  }

  /**
   * Resolves address string to nearest known graph zone node.
   * Fallback to 'Sector 32' if unmapped to prevent Dijkstra crashes.
   */
  resolveZone(addressStr) {
    if (!addressStr) return 'Sector 32';
    const str = String(addressStr).toLowerCase();

    for (const [nodeId, data] of this.nodes.entries()) {
      if (str.includes(nodeId.toLowerCase()) || (data.name && str.includes(data.name.toLowerCase()))) {
        return nodeId;
      }
    }

    if (str.includes('17')) return 'Sector 17';
    if (str.includes('22')) return 'Sector 22';
    if (str.includes('pgi') || str.includes('postgraduate')) return 'PGI';
    if (str.includes('mohali')) return 'Mohali Phase 7';
    if (str.includes('tribune')) return 'Tribune Chowk';
    if (str.includes('panchkula')) return 'Panchkula';

    return 'Sector 32'; // Default hospital hub
  }
}

/**
 * Pre-configured Chandler Service Area Graph Instance
 */
function createHospitalZoneGraph() {
  const g = new Graph();

  // Add Nodes
  g.addNode('Sector 32', { name: 'Sector 32 Hospital Bay', lat: 30.7088, lng: 76.7821 });
  g.addNode('Sector 17', { name: 'Sector 17 City Center', lat: 30.7398, lng: 76.7827 });
  g.addNode('Sector 22', { name: 'Sector 22 Market', lat: 30.7333, lng: 76.7725 });
  g.addNode('PGI', { name: 'PGI Medical Campus', lat: 30.7626, lng: 76.7766 });
  g.addNode('Tribune Chowk', { name: 'Tribune Intersection', lat: 30.7062, lng: 76.7981 });
  g.addNode('Mohali Phase 7', { name: 'Mohali Industrial Area', lat: 30.7046, lng: 76.7179 });
  g.addNode('Panchkula', { name: 'Panchkula Urban Estate', lat: 30.6942, lng: 76.8606 });

  // Add Weighted Edges (Distances in Kilometers)
  g.addEdge('Sector 32', 'Tribune Chowk', 2.5);
  g.addEdge('Sector 32', 'Sector 17', 4.0);
  g.addEdge('Sector 32', 'Sector 22', 3.2);
  g.addEdge('Sector 17', 'Sector 22', 1.8);
  g.addEdge('Sector 17', 'PGI', 3.5);
  g.addEdge('Sector 22', 'PGI', 4.2);
  g.addEdge('Tribune Chowk', 'Panchkula', 6.0);
  g.addEdge('Sector 32', 'Mohali Phase 7', 7.5);
  g.addEdge('Sector 22', 'Mohali Phase 7', 6.8);

  return g;
}

module.exports = { Graph, createHospitalZoneGraph };
