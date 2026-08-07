import React from 'react';
import { HeartPulse, GitBranch, ExternalLink, Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-600 to-rose-700 p-[2px] shadow-lg shadow-rose-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-white via-slate-100 to-rose-300 bg-clip-text text-transparent tracking-tight">
              Hospital Emergency Management System
            </h1>
            <p className="text-[10px] font-mono text-rose-400/90 uppercase tracking-wider">
              C++ STL Data Structures & Real-Time Triage Engine
            </p>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://github.com/shivenchauhan1/Hospital-Emergency-Management-System"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            <GitBranch className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">GitHub Repository</span>
          </a>

          <div className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            LIVE SYSTEM
          </div>
        </div>
      </div>
    </header>
  );
}
