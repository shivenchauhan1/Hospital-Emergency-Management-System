import React from 'react';
import { History, Activity } from 'lucide-react';

export default function HospitalStateTraceTable({ historyTrace = [] }) {
  if (!historyTrace || historyTrace.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center text-slate-500 text-xs">
        No state trace history recorded yet. Execute operations above to populate the state trace table.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Hospital System State Trace Table (Step-by-Step History)
          </h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          Total Steps: {historyTrace.length}
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[700px] text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
              <th className="p-3 w-16 text-center">Step</th>
              <th className="p-3 text-cyan-400">Executed Operation</th>
              <th className="p-3 text-white">Registry Size</th>
              <th className="p-3 text-rose-400">Emergency Heap</th>
              <th className="p-3 text-teal-400">Outpatient FIFO</th>
              <th className="p-3 text-purple-400">Treatment History</th>
              <th className="p-3 text-amber-400">Undo Stack Top</th>
            </tr>
          </thead>
          <tbody>
            {historyTrace.map((row) => (
              <tr key={row.step} className="border-b border-slate-800/60 hover:bg-slate-800/50 transition-colors">
                <td className="p-3 text-center font-bold text-slate-200">#{row.step}</td>
                <td className="p-3 font-semibold text-white">{row.operation}</td>
                <td className="p-3 text-cyan-300 font-bold">{row.registrySize} records</td>
                <td className="p-3 text-rose-300 max-w-xs truncate">{row.emergencyQueue}</td>
                <td className="p-3 text-teal-300 max-w-xs truncate">{row.normalQueue}</td>
                <td className="p-3 text-purple-300 truncate">{row.history}</td>
                <td className="p-3 text-amber-300 truncate">{row.undoTop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
