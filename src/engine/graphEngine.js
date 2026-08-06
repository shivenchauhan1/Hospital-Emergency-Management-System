// Step-by-Step Generator Engine for 7 Graph Algorithms

export function generateBFSSteps(graphData, startNodeId) {
  const { nodes, edges } = graphData;
  const steps = [];
  const visited = new Set();
  const queue = [startNodeId];
  let iterations = 0;
  let relaxations = 0;

  visited.add(startNodeId);

  steps.push({
    activeNode: startNodeId,
    visitedNodes: Array.from(visited),
    queue: [...queue],
    activeEdge: null,
    path: [startNodeId],
    iterations,
    relaxations,
    line: 3,
    message: `Initialized BFS. Enqueued start node ${startNodeId}`
  });

  while (queue.length > 0) {
    iterations++;
    const curr = queue.shift();

    steps.push({
      activeNode: curr,
      visitedNodes: Array.from(visited),
      queue: [...queue],
      activeEdge: null,
      iterations,
      relaxations,
      line: 6,
      message: `Dequeued node ${curr}. Exploring neighbors.`
    });

    const neighbors = edges.filter(e => e.source === curr || e.target === curr);

    for (const edge of neighbors) {
      const neighborId = edge.source === curr ? edge.target : edge.source;
      relaxations++;

      steps.push({
        activeNode: curr,
        visitedNodes: Array.from(visited),
        queue: [...queue],
        activeEdge: { source: curr, target: neighborId },
        iterations,
        relaxations,
        line: 8,
        message: `Inspecting edge (${curr} -> ${neighborId})`
      });

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
        steps.push({
          activeNode: neighborId,
          visitedNodes: Array.from(visited),
          queue: [...queue],
          activeEdge: { source: curr, target: neighborId },
          iterations,
          relaxations,
          line: 10,
          message: `Visited node ${neighborId} and added to queue`
        });
      }
    }
  }

  steps.push({
    activeNode: null,
    visitedNodes: Array.from(visited),
    queue: [],
    activeEdge: null,
    iterations,
    relaxations,
    line: 14,
    message: `BFS traversal complete! Visited ${visited.size} nodes in ${iterations} iterations.`
  });

  return steps;
}

export function generateDFSSteps(graphData, startNodeId) {
  const { nodes, edges } = graphData;
  const steps = [];
  const visited = new Set();
  let iterations = 0;
  let relaxations = 0;

  steps.push({
    activeNode: startNodeId,
    visitedNodes: [],
    stack: [startNodeId],
    activeEdge: null,
    iterations,
    relaxations,
    line: 1,
    message: `Starting DFS from root node ${startNodeId}`
  });

  function dfsHelper(nodeId) {
    visited.add(nodeId);
    iterations++;

    steps.push({
      activeNode: nodeId,
      visitedNodes: Array.from(visited),
      activeEdge: null,
      iterations,
      relaxations,
      line: 2,
      message: `Visiting node ${nodeId}`
    });

    const neighbors = edges.filter(e => e.source === nodeId || e.target === nodeId);

    for (const edge of neighbors) {
      const neighborId = edge.source === nodeId ? edge.target : edge.source;
      relaxations++;

      steps.push({
        activeNode: nodeId,
        visitedNodes: Array.from(visited),
        activeEdge: { source: nodeId, target: neighborId },
        iterations,
        relaxations,
        line: 4,
        message: `Checking neighbor edge (${nodeId} -> ${neighborId})`
      });

      if (!visited.has(neighborId)) {
        dfsHelper(neighborId);
      }
    }
  }

  dfsHelper(startNodeId);

  steps.push({
    activeNode: null,
    visitedNodes: Array.from(visited),
    activeEdge: null,
    iterations,
    relaxations,
    line: 8,
    message: `DFS complete! Total visited nodes: ${visited.size}`
  });

  return steps;
}

export function generateDijkstraSteps(graphData, startNodeId) {
  const { nodes, edges } = graphData;
  const steps = [];
  const dist = {};
  const prev = {};
  const unvisited = new Set(nodes.map(n => n.id));
  let iterations = 0;
  let relaxations = 0;

  nodes.forEach(n => {
    dist[n.id] = n.id === startNodeId ? 0 : Infinity;
    prev[n.id] = null;
  });

  steps.push({
    activeNode: startNodeId,
    visitedNodes: [],
    distances: { ...dist },
    activeEdge: null,
    iterations,
    relaxations,
    line: 2,
    message: `Initialized distances. Start node ${startNodeId} dist = 0, others = ∞`
  });

  while (unvisited.size > 0) {
    iterations++;
    // Get unvisited node with smallest distance
    let u = null;
    let minDist = Infinity;
    unvisited.forEach(id => {
      if (dist[id] < minDist) {
        minDist = dist[id];
        u = id;
      }
    });

    if (u === null || minDist === Infinity) break;

    unvisited.delete(u);

    steps.push({
      activeNode: u,
      visitedNodes: nodes.filter(n => !unvisited.has(n.id)).map(n => n.id),
      distances: { ...dist },
      activeEdge: null,
      iterations,
      relaxations,
      line: 6,
      message: `Selected minimum distance unvisited node ${u} (dist = ${dist[u]})`
    });

    const neighbors = edges.filter(e => e.source === u || e.target === u);

    for (const edge of neighbors) {
      const v = edge.source === u ? edge.target : edge.source;
      if (!unvisited.has(v)) continue;

      const alt = dist[u] + edge.weight;
      relaxations++;

      steps.push({
        activeNode: u,
        visitedNodes: nodes.filter(n => !unvisited.has(n.id)).map(n => n.id),
        distances: { ...dist },
        activeEdge: { source: u, target: v },
        iterations,
        relaxations,
        line: 8,
        message: `Relaxing edge (${u} -> ${v}): current dist[${v}] = ${dist[v]}, alt dist = ${alt}`
      });

      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        steps.push({
          activeNode: v,
          visitedNodes: nodes.filter(n => !unvisited.has(n.id)).map(n => n.id),
          distances: { ...dist },
          activeEdge: { source: u, target: v },
          iterations,
          relaxations,
          line: 10,
          message: `Updated distance of node ${v} to ${alt}`
        });
      }
    }
  }

  steps.push({
    activeNode: null,
    visitedNodes: nodes.map(n => n.id),
    distances: { ...dist },
    activeEdge: null,
    iterations,
    relaxations,
    line: 14,
    message: `Dijkstra's Algorithm complete! Total relaxations: ${relaxations}`
  });

  return steps;
}

export function generateFloydWarshallSteps(graphData) {
  const { nodes, edges } = graphData;
  const n = nodes.length;
  const nodeMap = {};
  nodes.forEach((node, idx) => { nodeMap[node.id] = idx; });
  let iterations = 0;
  let relaxations = 0;

  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;

  edges.forEach(e => {
    const u = nodeMap[e.source];
    const v = nodeMap[e.target];
    dist[u][v] = Math.min(dist[u][v], e.weight);
    dist[v][u] = Math.min(dist[v][u], e.weight); // undirected fallback
  });

  const steps = [];

  steps.push({
    matrix: JSON.parse(JSON.stringify(dist)),
    k: null, i: null, j: null,
    iterations, relaxations,
    line: 3,
    message: 'Initialized distance matrix with direct edge weights.'
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        iterations++;
        relaxations++;
        let updated = false;

        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          updated = true;
        }

        // Push key step samples to avoid UI lag while showing progress
        if (updated || iterations % 5 === 0) {
          steps.push({
            matrix: JSON.parse(JSON.stringify(dist)),
            nodesList: nodes.map(n => n.id),
            k: nodes[k].id,
            i: nodes[i].id,
            j: nodes[j].id,
            iterations,
            relaxations,
            line: 8,
            message: updated
              ? `Shortest path dist[${nodes[i].id}][${nodes[j].id}] updated to ${dist[i][j]} via intermediate node ${nodes[k].id}`
              : `Checking if path ${nodes[i].id} -> ${nodes[k].id} -> ${nodes[j].id} is shorter than ${dist[i][j]}`
          });
        }
      }
    }
  }

  steps.push({
    matrix: JSON.parse(JSON.stringify(dist)),
    nodesList: nodes.map(n => n.id),
    k: null, i: null, j: null,
    iterations, relaxations,
    line: 12,
    message: `Floyd-Warshall complete! All-pairs shortest path matrix computed.`
  });

  return steps;
}

export function generatePrimSteps(graphData, startNodeId) {
  const { nodes, edges } = graphData;
  const steps = [];
  const visited = new Set([startNodeId]);
  const mstEdges = [];
  let iterations = 0;
  let relaxations = 0;

  steps.push({
    activeNode: startNodeId,
    visitedNodes: Array.from(visited),
    mstEdges: [],
    activeEdge: null,
    iterations,
    relaxations,
    line: 2,
    message: `Initialized Prim's MST starting from node ${startNodeId}`
  });

  while (visited.size < nodes.length) {
    iterations++;
    let minEdge = null;
    let minWeight = Infinity;

    // Find smallest weight edge connecting visited to unvisited
    for (const edge of edges) {
      relaxations++;
      const uVisited = visited.has(edge.source);
      const vVisited = visited.has(edge.target);

      if ((uVisited && !vVisited) || (!uVisited && vVisited)) {
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }
    }

    if (!minEdge) break; // Disconnected graph

    const newVisitedNode = visited.has(minEdge.source) ? minEdge.target : minEdge.source;
    visited.add(newVisitedNode);
    mstEdges.push(minEdge);

    steps.push({
      activeNode: newVisitedNode,
      visitedNodes: Array.from(visited),
      mstEdges: [...mstEdges],
      activeEdge: minEdge,
      iterations,
      relaxations,
      line: 7,
      message: `Added minimum cut edge (${minEdge.source} - ${minEdge.target}, weight ${minEdge.weight}) to MST`
    });
  }

  steps.push({
    activeNode: null,
    visitedNodes: Array.from(visited),
    mstEdges: [...mstEdges],
    activeEdge: null,
    iterations,
    relaxations,
    line: 12,
    message: `Prim's MST complete! Total edges in MST: ${mstEdges.length}`
  });

  return steps;
}

export function generateKruskalSteps(graphData) {
  const { nodes, edges } = graphData;
  const steps = [];
  const mstEdges = [];
  let iterations = 0;
  let relaxations = 0;

  // DSU implementation
  const parent = {};
  nodes.forEach(n => parent[n.id] = n.id);

  function find(i) {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]);
  }

  function union(i, j) {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  }

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  steps.push({
    activeEdge: null,
    mstEdges: [],
    iterations,
    relaxations,
    line: 3,
    message: `Sorted all ${edges.length} edges in non-decreasing order of weight`
  });

  for (const edge of sortedEdges) {
    iterations++;
    relaxations++;

    const root1 = find(edge.source);
    const root2 = find(edge.target);

    steps.push({
      activeEdge: edge,
      mstEdges: [...mstEdges],
      iterations,
      relaxations,
      line: 5,
      message: `Inspecting sorted edge (${edge.source} - ${edge.target}, weight ${edge.weight})`
    });

    if (root1 !== root2) {
      union(edge.source, edge.target);
      mstEdges.push(edge);
      steps.push({
        activeEdge: edge,
        mstEdges: [...mstEdges],
        iterations,
        relaxations,
        line: 7,
        message: `Edge (${edge.source} - ${edge.target}) does NOT form a cycle. Added to MST.`
      });
    } else {
      steps.push({
        activeEdge: edge,
        mstEdges: [...mstEdges],
        iterations,
        relaxations,
        line: 9,
        message: `Edge (${edge.source} - ${edge.target}) forms a cycle. Rejected.`
      });
    }

    if (mstEdges.length === nodes.length - 1) break;
  }

  steps.push({
    activeEdge: null,
    mstEdges: [...mstEdges],
    iterations,
    relaxations,
    line: 12,
    message: `Kruskal's MST complete! Total MST edges: ${mstEdges.length}`
  });

  return steps;
}

export function generateBellmanFordSteps(graphData, startNodeId) {
  const { nodes, edges } = graphData;
  const steps = [];
  const dist = {};
  let iterations = 0;
  let relaxations = 0;

  nodes.forEach(n => dist[n.id] = n.id === startNodeId ? 0 : Infinity);

  steps.push({
    distances: { ...dist },
    activeEdge: null,
    iterations,
    relaxations,
    line: 2,
    message: `Initialized Bellman-Ford distances. Start node ${startNodeId} dist = 0`
  });

  const vCount = nodes.length;

  for (let i = 1; i <= vCount - 1; i++) {
    let anyRelaxed = false;
    for (const edge of edges) {
      iterations++;
      relaxations++;

      if (dist[edge.source] !== Infinity && dist[edge.source] + edge.weight < dist[edge.target]) {
        dist[edge.target] = dist[edge.source] + edge.weight;
        anyRelaxed = true;

        steps.push({
          distances: { ...dist },
          activeEdge: edge,
          iterations,
          relaxations,
          line: 6,
          message: `Relaxed edge (${edge.source} -> ${edge.target}): new dist[${edge.target}] = ${dist[edge.target]}`
        });
      }
    }
    if (!anyRelaxed) break;
  }

  // Check negative cycle
  let hasNegativeCycle = false;
  for (const edge of edges) {
    if (dist[edge.source] !== Infinity && dist[edge.source] + edge.weight < dist[edge.target]) {
      hasNegativeCycle = true;
      break;
    }
  }

  steps.push({
    distances: { ...dist },
    activeEdge: null,
    iterations,
    relaxations,
    line: 10,
    message: hasNegativeCycle
      ? 'WARNING: Negative-weight cycle detected in graph!'
      : `Bellman-Ford complete! Total relaxations: ${relaxations}`
  });

  return steps;
}
