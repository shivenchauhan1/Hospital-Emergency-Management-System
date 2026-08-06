import React from 'react';

export default function SortingVisualizer({ stepState }) {
  if (!stepState || !stepState.array) {
    return <div className="p-8 text-center text-slate-500">Initializing Sorting Visualizer...</div>;
  }

  const { array, comparing = [], swapping = [], sorted = [], pivot = null } = stepState;
  const maxVal = Math.max(...array, 100);

  return (
    <div className="w-full h-80 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex items-end justify-center gap-2 overflow-x-auto relative shadow-inner">
      {array.map((val, idx) => {
        const isComparing = comparing.includes(idx);
        const isSwapping = swapping.includes(idx);
        const isSorted = sorted.includes(idx);
        const isPivot = pivot === idx;

        let barBg = 'bg-slate-700 hover:bg-slate-600';
        let barBorder = 'border-slate-600';
        let textBg = 'text-slate-400';

        if (isSwapping) {
          barBg = 'bg-gradient-to-t from-rose-600 to-pink-500 shadow-lg shadow-rose-500/30 scale-105';
          barBorder = 'border-rose-400';
          textBg = 'text-rose-400 font-bold';
        } else if (isComparing) {
          barBg = 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/30 scale-105';
          barBorder = 'border-amber-300';
          textBg = 'text-amber-300 font-bold';
        } else if (isPivot) {
          barBg = 'bg-gradient-to-t from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/30 scale-105';
          barBorder = 'border-purple-300';
          textBg = 'text-purple-300 font-bold';
        } else if (isSorted) {
          barBg = 'bg-gradient-to-t from-emerald-600 to-teal-500';
          barBorder = 'border-emerald-400';
          textBg = 'text-emerald-400';
        }

        const heightPercent = Math.max(10, Math.round((val / maxVal) * 85));

        return (
          <div
            key={idx}
            className="flex-1 max-w-[48px] flex flex-col items-center gap-2 group transition-all duration-200"
          >
            {/* Value Label */}
            <span className={`text-[11px] font-mono ${textBg}`}>
              {val}
            </span>

            {/* Vertical Bar */}
            <div
              style={{ height: `${heightPercent}%` }}
              className={`w-full rounded-t-xl border-t border-x ${barBg} ${barBorder} transition-all duration-200 flex items-center justify-center`}
            >
              {isPivot && (
                <span className="text-[9px] font-extrabold text-white uppercase rotate-90">
                  PIVOT
                </span>
              )}
            </div>

            {/* Index Label */}
            <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400">
              [{idx}]
            </span>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute top-3 right-4 flex items-center gap-4 text-[11px] font-medium bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-slate-300">Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-300">Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span className="text-slate-300">Pivot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">Sorted</span>
        </div>
      </div>
    </div>
  );
}
