import React from 'react';
import { HeartPulse, GitBranch, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-200">Hospital Emergency Management System</p>
            <p className="text-[11px] text-slate-500">C++ STL Data Structures Project (unordered_map, priority_queue, queue, list, stack, Sorting)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <a
            href="https://github.com/shivenchauhan1/Hospital-Emergency-Management-System"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <GitBranch className="w-3.5 h-3.5 text-rose-400" />
            GitHub Repo
          </a>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 text-slate-500">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>for Healthcare DSA</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
