import React from 'react';
import { GitBranch, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
            2P
          </div>
          <div>
            <p className="font-semibold text-slate-200">Universal Algorithm Visualizer & Comparator</p>
            <p className="text-[11px] text-slate-500">Structured for 2-Developer Equal Work Distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setActivePage('complexity')}
            className="hover:text-cyan-400 transition-colors"
          >
            Algorithms Cheat Sheet
          </button>
          <button
            onClick={() => setActivePage('benchmark')}
            className="hover:text-cyan-400 transition-colors"
          >
            Live Benchmarks
          </button>
          <button
            onClick={() => setActivePage('team')}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            2-Person Roadmap
          </button>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>for DSA Mastery</span>
        </div>
      </div>
    </footer>
  );
}
