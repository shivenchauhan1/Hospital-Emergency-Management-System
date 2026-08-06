// Step-by-Step Generator Engine for Sudoku Solver & Rat in a Maze Backtracking

export function generateSudokuSteps(initialBoard) {
  const steps = [];
  const board = JSON.parse(JSON.stringify(initialBoard));
  const N = board.length;
  let recursiveCalls = 0;
  let backtracks = 0;

  steps.push({
    board: JSON.parse(JSON.stringify(board)),
    activeCell: null,
    status: 'start',
    recursiveCalls,
    backtracks,
    line: 1,
    message: `Initialized ${N}x${N} Sudoku puzzle solver.`
  });

  function isValid(b, row, col, num) {
    for (let x = 0; x < N; x++) {
      if (b[row][x] === num || b[x][col] === num) return false;
    }
    const boxSize = Math.sqrt(N);
    const startRow = row - (row % boxSize);
    const startCol = col - (col % boxSize);

    for (let r = 0; r < boxSize; r++) {
      for (let c = 0; c < boxSize; c++) {
        if (b[r + startRow][c + startCol] === num) return false;
      }
    }
    return true;
  }

  function solve() {
    recursiveCalls++;
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= N; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              steps.push({
                board: JSON.parse(JSON.stringify(board)),
                activeCell: { row, col, num },
                status: 'placed',
                recursiveCalls,
                backtracks,
                line: 7,
                message: `Placed ${num} at cell (${row}, ${col})`
              });

              if (solve()) return true;

              // Backtrack
              board[row][col] = 0;
              backtracks++;
              steps.push({
                board: JSON.parse(JSON.stringify(board)),
                activeCell: { row, col, num },
                status: 'backtrack',
                recursiveCalls,
                backtracks,
                line: 9,
                message: `Backtracked digit ${num} from cell (${row}, ${col})`
              });
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  const solved = solve();

  steps.push({
    board: JSON.parse(JSON.stringify(board)),
    activeCell: null,
    status: solved ? 'success' : 'failed',
    recursiveCalls,
    backtracks,
    line: 13,
    message: solved
      ? `Sudoku solved successfully! Total recursive calls: ${recursiveCalls}, backtracks: ${backtracks}`
      : 'No valid solution exists for this Sudoku board.'
  });

  return steps;
}

export function generateRatInMazeSteps(mazeGrid) {
  const steps = [];
  const N = mazeGrid.length;
  const sol = Array.from({ length: N }, () => Array(N).fill(0));
  let recursiveCalls = 0;
  let backtracks = 0;

  steps.push({
    maze: mazeGrid,
    solution: JSON.parse(JSON.stringify(sol)),
    currentPos: { r: 0, c: 0 },
    recursiveCalls,
    backtracks,
    line: 1,
    message: 'Starting Rat in a Maze pathfinding from (0,0) to target bottom-right.'
  });

  function isSafe(r, c) {
    return r >= 0 && r < N && c >= 0 && c < N && mazeGrid[r][c] === 1 && sol[r][c] === 0;
  }

  function solveMaze(r, c) {
    recursiveCalls++;

    if (r === N - 1 && c === N - 1 && mazeGrid[r][c] === 1) {
      sol[r][c] = 1;
      steps.push({
        maze: mazeGrid,
        solution: JSON.parse(JSON.stringify(sol)),
        currentPos: { r, c },
        recursiveCalls,
        backtracks,
        line: 3,
        message: 'Destination (N-1, N-1) reached! Path found!'
      });
      return true;
    }

    if (isSafe(r, c)) {
      sol[r][c] = 1;
      steps.push({
        maze: mazeGrid,
        solution: JSON.parse(JSON.stringify(sol)),
        currentPos: { r, c },
        recursiveCalls,
        backtracks,
        line: 6,
        message: `Stepped into cell (${r}, ${c})`
      });

      // Try Down
      if (solveMaze(r + 1, c)) return true;
      // Try Right
      if (solveMaze(r, c + 1)) return true;
      // Try Up
      if (solveMaze(r - 1, c)) return true;
      // Try Left
      if (solveMaze(r, c - 1)) return true;

      // Backtrack
      sol[r][c] = 0;
      backtracks++;
      steps.push({
        maze: mazeGrid,
        solution: JSON.parse(JSON.stringify(sol)),
        currentPos: { r, c },
        recursiveCalls,
        backtracks,
        line: 12,
        message: `Dead end at cell (${r}, ${c}). Backtracking...`
      });
      return false;
    }
    return false;
  }

  const pathFound = solveMaze(0, 0);

  steps.push({
    maze: mazeGrid,
    solution: JSON.parse(JSON.stringify(sol)),
    currentPos: null,
    pathFound,
    recursiveCalls,
    backtracks,
    line: 16,
    message: pathFound
      ? `Maze solved! Total recursive steps: ${recursiveCalls}, backtracks: ${backtracks}`
      : 'No valid path found to reach destination.'
  });

  return steps;
}
