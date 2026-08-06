import React, { useState } from 'react';
import { Search, PlayCircle, BarChart3, Columns, ArrowRight, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';
import { ALGORITHMS_DATA, ALGORITHM_CATEGORIES } from '../data/algorithmsData';

export default function HomePage({ setActivePage, setSelectedAlgorithm }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const allAlgoList = Object.values(ALGORITHMS_DATA);

  const filteredAlgorithms = allAlgoList.filter((algo) => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || algo.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleLaunchVisualizer = (algoId) => {
    setSelectedAlgorithm(algoId);
    setActivePage('visualizer');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 border border-slate-800 p-8 lg:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Universal Algorithm Visualization & Benchmarking Platform
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Master <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Data Structures & Algorithms</span> through Interactive Step-by-Step Execution.
          </h1>

          <p className="text-slate-400 text-sm lg:text-base leading-relaxed">
            Visualize 18 core algorithms across Sorting, Graphs, Binary Trees, Dynamic Programming, and Backtracking. Benchmark real execution times, run side-by-side algorithm races, and inspect line-by-line pseudocode execution.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <span className="text-3xl font-extrabold text-cyan-400 font-mono">18</span>
              <p className="text-xs text-slate-400 font-medium">Core Algorithms</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">5</span>
              <p className="text-xs text-slate-400 font-medium">DSA Categories</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <span className="text-3xl font-extrabold text-purple-400 font-mono">2P</span>
              <p className="text-xs text-slate-400 font-medium">Team Architecture</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <span className="text-3xl font-extrabold text-amber-400 font-mono">100%</span>
              <p className="text-xs text-slate-400 font-medium">Interactive Controls</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActivePage('hospital')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-rose-500 via-pink-600 to-rose-700 text-slate-950 shadow-lg shadow-rose-500/25 hover:brightness-110 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current text-slate-950" />
              Hospital System (C++ STL)
            </button>
            <button
              onClick={() => setActivePage('visualizer')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all active:scale-95"
            >
              <PlayCircle className="w-4 h-4 text-cyan-400" />
              18 Algo Visualizer
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              All Categories (18)
            </button>
            {ALGORITHM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search algorithm (e.g. Dijkstra, QuickSort)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Algorithm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.map((algo) => (
            <div
              key={algo.id}
              onClick={() => handleLaunchVisualizer(algo.id)}
              className="group bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 text-cyan-400 uppercase tracking-wider">
                    {algo.categoryName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {algo.timeComplexity.worst}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {algo.name}
                </h3>

                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  {algo.shortDesc}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-slate-800/60 mt-4 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Visualize Step-by-Step</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
