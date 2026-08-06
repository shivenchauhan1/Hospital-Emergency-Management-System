import React, { useState } from 'react';
import { BookOpen, Search, Code2, Clock, Cpu, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';
import { ALGORITHMS_DATA, ALGORITHM_CATEGORIES } from '../data/algorithmsData';

export default function ComplexityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedAlgoId, setSelectedAlgoId] = useState('bubble');

  const allAlgoList = Object.values(ALGORITHMS_DATA);

  const filteredList = allAlgoList.filter((algo) => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || algo.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const activeAlgo = ALGORITHMS_DATA[selectedAlgoId] || ALGORITHMS_DATA.bubble;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          Module 5 • Complexity & Theory Panel
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Algorithm Theory & Cheat Sheet
        </h1>
        <p className="text-slate-400 text-xs lg:text-sm max-w-3xl leading-relaxed">
          Comprehensive reference guide for all 18 algorithms featuring line-by-line pseudocode, Big-O time/space complexities, optimal use cases, advantages, and disadvantages.
        </p>
      </div>

      {/* Main Grid: Left Sidebar Selector & Right Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Selector Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 max-h-[600px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredList.map((algo) => {
              const isSelected = selectedAlgoId === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgoId(algo.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <p className="text-xs">{algo.name}</p>
                    <p className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {algo.categoryName}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                    {algo.timeComplexity.worst}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
            {/* Title & Category Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                  {activeAlgo.categoryName}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">
                  {activeAlgo.name}
                </h2>
              </div>
            </div>

            {/* Big-O Complexity Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Best Case</span>
                <p className="text-base font-extrabold font-mono text-emerald-400 mt-1">
                  {activeAlgo.timeComplexity.best}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Average Case</span>
                <p className="text-base font-extrabold font-mono text-amber-400 mt-1">
                  {activeAlgo.timeComplexity.average}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Worst Case</span>
                <p className="text-base font-extrabold font-mono text-rose-400 mt-1">
                  {activeAlgo.timeComplexity.worst}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] font-medium text-slate-500 uppercase">Space Complexity</span>
                <p className="text-base font-extrabold font-mono text-purple-400 mt-1">
                  {activeAlgo.spaceComplexity}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Overview</h3>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {activeAlgo.description}
              </p>
            </div>

            {/* Pseudocode Block */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" /> Pseudocode Implementation
              </h3>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
                {activeAlgo.pseudocode.map((line, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-slate-600 w-6 text-right select-none">{idx + 1}</span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                  <CheckCircle className="w-4 h-4" /> Key Advantages
                </h4>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {activeAlgo.advantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                  <XCircle className="w-4 h-4" /> Limitations & Cons
                </h4>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {activeAlgo.disadvantages.map((dis, idx) => (
                    <li key={idx}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Real-World Applications */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Real-World Applications</h3>
              <div className="flex flex-wrap gap-2">
                {activeAlgo.applications.map((app, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 text-cyan-400 border border-slate-800 flex items-center gap-1.5"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
