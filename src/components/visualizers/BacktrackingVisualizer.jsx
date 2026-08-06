import React from 'react';

export default function BacktrackingVisualizer({ stepState, algorithmId }) {
  if (!stepState) {
    return <div className="p-8 text-center text-slate-500">Initializing Backtracking Visualizer...</div>;
  }

  if (algorithmId === 'sudoku') {
    const { board = [], activeCell, status } = stepState;
    const N = board.length;

    return (
      <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-inner flex flex-col items-center gap-4">
        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
          Sudoku Solver Grid ({N}x{N})
        </h4>

        <div className={`grid ${N === 4 ? 'grid-cols-4' : 'grid-cols-9'} gap-1.5 p-3 bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-xl`}>
          {board.map((row, r) =>
            row.map((val, c) => {
              const isActive = activeCell && activeCell.row === r && activeCell.col === c;
              const isBacktrack = isActive && status === 'backtrack';
              const isPlaced = isActive && status === 'placed';

              let cellBg = 'bg-slate-950 text-slate-300';
              let border = 'border-slate-800';

              if (isBacktrack) {
                cellBg = 'bg-rose-500/30 text-rose-300 font-extrabold scale-110 shadow-lg';
                border = 'border-rose-400';
              } else if (isPlaced) {
                cellBg = 'bg-emerald-500/30 text-emerald-300 font-extrabold scale-110 shadow-lg';
                border = 'border-emerald-400';
              } else if (val > 0) {
                cellBg = 'bg-slate-800 text-cyan-300 font-bold';
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-10 h-10 rounded-xl border ${border} ${cellBg} flex items-center justify-center text-base font-mono transition-all duration-150`}
                >
                  {val === 0 ? '' : val}
                </div>
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-medium bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">Placed Candidate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-300">Backtracked</span>
          </div>
        </div>
      </div>
    );
  }

  // Rat in a Maze Visualizer
  const { maze = [], solution = [], currentPos } = stepState;
  const N = maze.length;

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-inner flex flex-col items-center gap-4">
      <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
        Rat in a Maze Matrix Grid ({N}x{N})
      </h4>

      <div className="grid grid-cols-8 gap-1.5 p-3 bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-xl">
        {maze.map((row, r) =>
          row.map((cell, c) => {
            const isWall = cell === 0;
            const isPath = solution[r][c] === 1;
            const isRatHere = currentPos && currentPos.r === r && currentPos.c === c;
            const isStart = r === 0 && c === 0;
            const isEnd = r === N - 1 && c === N - 1;

            let cellBg = 'bg-slate-950 border-slate-800';
            let icon = null;

            if (isWall) {
              cellBg = 'bg-slate-800/90 border-slate-700 opacity-60';
              icon = <span className="text-[10px] text-slate-500 font-mono">WALL</span>;
            } else if (isRatHere) {
              cellBg = 'bg-cyan-500 text-slate-950 font-extrabold scale-110 shadow-lg shadow-cyan-500/40 animate-pulse';
              icon = <span className="text-sm">🐭</span>;
            } else if (isStart) {
              cellBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
              icon = <span className="text-xs">S</span>;
            } else if (isEnd) {
              cellBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
              icon = <span className="text-xs">🧀</span>;
            } else if (isPath) {
              cellBg = 'bg-cyan-500/30 text-cyan-300 border-cyan-400';
              icon = <span className="w-2 h-2 rounded-full bg-cyan-400"></span>;
            }

            return (
              <div
                key={`${r}-${c}`}
                className={`w-9 h-9 rounded-xl border ${cellBg} flex items-center justify-center font-mono transition-all duration-150`}
              >
                {icon}
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] font-medium bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300">Rat Path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
          <span className="text-slate-300">Obstacle Wall</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🧀</span>
          <span className="text-slate-300">Destination</span>
        </div>
      </div>
    </div>
  );
}
