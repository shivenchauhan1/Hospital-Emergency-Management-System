import React from 'react';
import { Table, History } from 'lucide-react';

export default function StateTraceTable({ historyTrace = [] }) {
  if (!historyTrace || historyTrace.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center text-slate-500 text-xs">
        No state trace history recorded yet. Execute operations above to populate the state trace table.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            State Trace Table (Step-by-Step History)
          </h3>
        </div>
        <span className="text-xs font-mono text-cyan-400">
          Total Recorded Steps: {historyTrace.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
              <th className="p-3 w-16 text-center">Step</th>
              <th className="p-3 text-cyan-400">Operation</th>
              <th className="p-3 text-cyan-300">Cart (Linked List)</th>
              <th className="p-3 text-rose-400">Undo Stack</th>
              <th className="p-3 text-rose-300">Redo Stack</th>
              <th className="p-3 text-emerald-400">Checkout Queue</th>
              <th className="p-3 text-purple-400">Discount Heap</th>
            </tr>
          </thead>
          <tbody>
            {historyTrace.map((row) => (
              <tr key={row.step} className="border-b border-slate-800/60 hover:bg-slate-800/50 transition-colors">
                <td className="p-3 text-center font-bold text-slate-200">{row.step}</td>
                <td className="p-3 font-semibold text-white">{row.operation}</td>
                <td className="p-3 text-cyan-300">{row.cart}</td>
                <td className="p-3 text-rose-300">{row.undoStack}</td>
                <td className="p-3 text-rose-400">{row.redoStack}</td>
                <td className="p-3 text-emerald-300">{row.queue}</td>
                <td className="p-3 text-purple-300">{row.discounts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
