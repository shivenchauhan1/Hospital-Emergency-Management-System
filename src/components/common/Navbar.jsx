import React from 'react';
import { HeartPulse, PlayCircle, BarChart3, Columns, BookOpen, Users, Compass, Sparkles } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'hospital', label: 'Hospital Emergency System', icon: HeartPulse, highlight: true, emergency: true },
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'visualizer', label: '18 Algo Visualizer', icon: PlayCircle },
    { id: 'benchmark', label: 'Benchmark', icon: BarChart3 },
    { id: 'compare', label: 'Comparator', icon: Columns },
    { id: 'complexity', label: 'Complexity Panel', icon: BookOpen },
    { id: 'team', label: 'Team & Schedule', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => setActivePage('hospital')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-cyan-500 to-indigo-600 p-[2px] shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-rose-400 font-extrabold text-lg sm:text-xl tracking-tighter">AG</span>
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-rose-300 bg-clip-text text-transparent tracking-tight">
              AlgoPulse
            </h1>
            <p className="text-[9px] sm:text-[10px] font-medium text-rose-400/90 tracking-wider uppercase truncate max-w-[150px] sm:max-w-none">
              DSA Platform & Hospital System
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                    : item.highlight
                    ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="hidden sm:inline">PRD Specification</span> Active
          </div>
        </div>
      </div>

      {/* Mobile Nav Scrollbar */}
      <div className="md:hidden flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/60 overflow-x-auto scrollbar-none pb-0.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800/80 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
