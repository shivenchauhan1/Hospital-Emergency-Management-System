import React from 'react';
import { Trophy, Zap, Activity, RefreshCw } from 'lucide-react';

export default function Scorecard({ results = [] }) {
  if (!results || results.length === 0) return null;

  // Find winner by fewest operations / steps
  const sortedByOps = [...results].sort((a, b) => (a.comparisons + a.swaps) - (b.comparisons + b.swaps));
  const winner = sortedByOps[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Comparison Race Scorecard
          </h3>
        </div>
        {winner && (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
            🏆 Winner: {winner.name} ({winner.comparisons + winner.swaps} total ops)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((res, idx) => {
          const isWinner = winner && winner.id === res.id;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isWinner
                  ? 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white">{res.name}</h4>
                {isWinner && (
                  <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase">
                    1st Place
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-400" /> Comparisons / Checks:
                  </span>
                  <span className="font-bold text-amber-300">{res.comparisons}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Swaps / Rotations:
                  </span>
                  <span className="font-bold text-cyan-300">{res.swaps}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-purple-400" /> Total Steps:
                  </span>
                  <span className="font-bold text-purple-300">{res.totalSteps}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
