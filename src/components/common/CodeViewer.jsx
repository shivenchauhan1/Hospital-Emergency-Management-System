import React from 'react';
import { Code2, ArrowRight } from 'lucide-react';

export default function CodeViewer({ pseudocode = [], activeLine = null, message = '' }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Pseudocode Trace
          </h3>
        </div>
        {activeLine !== null && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Line {activeLine}
          </span>
        )}
      </div>

      {/* Code Block */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 bg-slate-950/80 scrollbar-thin scrollbar-thumb-slate-800">
        {pseudocode.map((lineText, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLine === lineNumber;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-3 py-1 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border-l-4 border-cyan-400 font-semibold shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-900/50'
              }`}
            >
              <span className={`w-6 text-right select-none text-[11px] ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                {lineNumber}
              </span>
              <span className="flex-1 whitespace-pre">{lineText}</span>
              {isActive && <ArrowRight className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
            </div>
          );
        })}
      </div>

      {/* Step Explanation Banner */}
      {message && (
        <div className="bg-slate-900/90 p-3 border-t border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
          <p className="font-sans leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}
