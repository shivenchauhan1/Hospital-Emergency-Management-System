// Default Presets and Initial State Generators for Visualizers

export const DEFAULT_SORTING_INPUT = [42, 18, 75, 29, 63, 11, 88, 34, 52, 95, 23, 67];

export const DEFAULT_GRAPH_PRESETS = {
  default: {
    nodes: [
      { id: 'A', x: 100, y: 150, label: 'A' },
      { id: 'B', x: 260, y: 80, label: 'B' },
      { id: 'C', x: 260, y: 220, label: 'C' },
      { id: 'D', x: 420, y: 80, label: 'D' },
      { id: 'E', x: 420, y: 220, label: 'E' },
      { id: 'F', x: 560, y: 150, label: 'F' }
    ],
    edges: [
      { source: 'A', target: 'B', weight: 4 },
      { source: 'A', target: 'C', weight: 2 },
      { source: 'B', target: 'C', weight: 1 },
      { source: 'B', target: 'D', weight: 5 },
      { source: 'C', target: 'E', weight: 8 },
      { source: 'C', target: 'D', weight: 10 },
      { source: 'D', target: 'E', weight: 2 },
      { source: 'D', target: 'F', weight: 6 },
      { source: 'E', target: 'F', weight: 3 }
    ],
    startNode: 'A',
    targetNode: 'F'
  },
  sparse: {
    nodes: [
      { id: '0', x: 100, y: 150, label: '0' },
      { id: '1', x: 250, y: 100, label: '1' },
      { id: '2', x: 250, y: 200, label: '2' },
      { id: '3', x: 400, y: 100, label: '3' },
      { id: '4', x: 400, y: 200, label: '4' }
    ],
    edges: [
      { source: '0', target: '1', weight: 3 },
      { source: '0', target: '2', weight: 1 },
      { source: '1', target: '3', weight: 4 },
      { source: '2', target: '4', weight: 2 },
      { source: '3', target: '4', weight: 5 }
    ],
    startNode: '0',
    targetNode: '4'
  }
};

export const DEFAULT_TREE_PRESETS = {
  bst: [45, 25, 65, 15, 35, 55, 75, 10, 20, 30, 40],
  avl: [10, 20, 30, 40, 50, 25, 35]
};

export const DEFAULT_DP_INPUTS = {
  knapsack: {
    capacity: 10,
    items: [
      { id: 1, name: 'Item 1', weight: 2, value: 6 },
      { id: 2, name: 'Item 2', weight: 3, value: 10 },
      { id: 3, name: 'Item 3', weight: 4, value: 12 },
      { id: 4, name: 'Item 4', weight: 5, value: 13 }
    ]
  },
  lcs: {
    str1: 'ALGORITHM',
    str2: 'LOGARITHM'
  }
};

export const DEFAULT_SUDOKU_BOARD_4X4 = [
  [1, 0, 0, 4],
  [0, 0, 2, 0],
  [0, 3, 0, 0],
  [2, 0, 0, 1]
];

export const DEFAULT_SUDOKU_BOARD_9X9 = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

export const DEFAULT_MAZE_GRID_8X8 = [
  [1, 1, 0, 0, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0, 0, 1],
  [0, 1, 0, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 1, 1, 1]
];
