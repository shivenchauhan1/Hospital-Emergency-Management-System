import React from 'react';

export default function DPVisualizer({ stepState, algorithmId }) {
  if (!stepState || !stepState.table) {
    return <div className="p-8 text-center text-slate-500">Initializing DP Visualizer...</div>;
  }

  const { table, currentCell, selectedItems = [], lcsString, items = [], str1 = '', str2 = '' } = stepState;

  if (algorithmId === 'knapsack') {
    const numRows = table.length;
    const numCols = table[0].length;

    return (
      <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-inner flex flex-col items-center gap-4">
        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
          0/1 Knapsack DP Table (Items x Capacity W)
        </h4>

        <table className="border-collapse text-xs font-mono">
          <thead>
            <tr>
              <th className="p-2 border border-slate-800 bg-slate-900 text-slate-400">Item \ W</th>
              {Array.from({ length: numCols }, (_, w) => (
                <th key={w} className="p-2 border border-slate-800 bg-slate-900 text-slate-300 font-bold min-w-[36px] text-center">
                  w={w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, r) => {
              const item = r > 0 ? items[r - 1] : null;
              return (
                <tr key={r}>
                  <td className="p-2 border border-slate-800 bg-slate-900 font-bold text-slate-300 min-w-[120px]">
                    {r === 0 ? 'Ø (Base 0)' : `${item?.name} (w:${item?.weight}, v:${item?.value})`}
                  </td>
                  {row.map((val, c) => {
                    const isCurrent = currentCell && currentCell.r === r && currentCell.c === c;
                    return (
                      <td
                        key={c}
                        className={`p-2 border border-slate-800 text-center font-bold transition-all ${
                          isCurrent
                            ? 'bg-purple-500/30 text-purple-300 border-purple-400 shadow-lg scale-105 animate-pulse'
                            : val > 0
                            ? 'bg-slate-900 text-slate-200'
                            : 'text-slate-600'
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {selectedItems.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Optimal Selected Subset: [{selectedItems.map(it => `${it.name} (w:${it.weight}, v:${it.value})`).join(', ')}]
          </div>
        )}
      </div>
    );
  }

  // LCS Visualizer
  const numRows = table.length;
  const numCols = table[0].length;

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-inner flex flex-col items-center gap-4">
      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
        LCS String Matrix ("{str1}" vs "{str2}")
      </h4>

      <table className="border-collapse text-xs font-mono">
        <thead>
          <tr>
            <th className="p-2 border border-slate-800 bg-slate-900 text-slate-400">Ø</th>
            <th className="p-2 border border-slate-800 bg-slate-900 text-slate-400">Ø</th>
            {str2.split('').map((char, j) => (
              <th key={j} className="p-2.5 border border-slate-800 bg-slate-900 text-cyan-400 font-extrabold text-sm min-w-[36px] text-center">
                {char}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, r) => (
            <tr key={r}>
              <td className="p-2.5 border border-slate-800 bg-slate-900 text-cyan-400 font-extrabold text-sm text-center">
                {r === 0 ? 'Ø' : str1[r - 1]}
              </td>
              {row.map((val, c) => {
                const isCurrent = currentCell && currentCell.r === r && currentCell.c === c;
                return (
                  <td
                    key={c}
                    className={`p-2 border border-slate-800 text-center font-bold transition-all ${
                      isCurrent
                        ? stepState.match
                          ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 scale-105 shadow-lg animate-pulse'
                          : 'bg-indigo-500/30 text-indigo-300 border-indigo-400 scale-105 shadow-lg'
                        : val > 0
                        ? 'bg-slate-900 text-slate-200'
                        : 'text-slate-600'
                    }`}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {lcsString && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Reconstructed Subsequence: "{lcsString}" (Length: {stepState.lcsLength})
        </div>
      )}
    </div>
  );
}
