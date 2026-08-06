import React from 'react';
import { Users, GitBranch, Calendar, CheckCircle, ShieldCheck, Code, Layers } from 'lucide-react';

export default function TeamPage() {
  const scheduleData = [
    { day: 'Day 1', p1: 'React Setup, Router, Theme & Glassmorphism Design System', p2: 'Sorting Engines (Bubble, Insertion, Merge, Quick, Heap)' },
    { day: 'Day 2', p1: 'Navbar, Controls Panel, Speed Slider & Playback Timer', p2: 'Graph Engines (BFS, DFS, Dijkstra, Floyd-Warshall)' },
    { day: 'Day 3', p1: 'Sorting & Graph Canvas Visualizers', p2: 'Tree Engines (BST & AVL Rotations)' },
    { day: 'Day 4', p1: 'Tree & DP 2D Matrix Visualizer', p2: 'DP Engines (Knapsack & LCS Table Fill)' },
    { day: 'Day 5', p1: 'Backtracking Grid (Sudoku & Maze Visualizer)', p2: 'Backtracking Engines (Sudoku & Rat in Maze)' },
    { day: 'Day 6', p1: 'Module 4: Side-by-Side Dual Visualizer & Comparator', p2: 'Module 3: Benchmarking Engine & Recharts Analytics' },
    { day: 'Day 7', p1: 'Module 1: Home Page & Category Search Integration', p2: 'Module 5: Complexity Reference Panel & Pseudocode Data' },
    { day: 'Day 8', p1: 'Integrated Testing & Responsive Layout Polish', p2: 'Benchmark Metrics Validation & Edge Case Debugging' },
    { day: 'Day 9', p1: 'UI Aesthetics & Step-by-Step Animation Smoothing', p2: 'Documentation, PPT & Report Preparation' },
    { day: 'Day 10', p1: 'Deployment & Final Release', p2: 'Deployment & Final Academic Presentation' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Users className="w-3.5 h-3.5" />
          2-Developer Work Distribution & Schedule
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Team Architecture & 10-Day Plan
        </h1>
        <p className="text-slate-400 text-xs lg:text-sm max-w-3xl leading-relaxed">
          Optimized equal 50/50 division of responsibilities for a 2-person development team across frontend UI design, step animation engines, algorithm implementation, benchmarking analytics, and project delivery.
        </p>
      </div>

      {/* 2-Person Work Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Developer 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">50% Workload</span>
              <h3 className="text-lg font-bold text-white">👨‍💻 Developer 1 – Frontend, UI/UX & Visualizers</h3>
            </div>
            <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-extrabold flex items-center justify-center text-sm">
              D1
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Navbar, Footer, Home Page & Responsive Glassmorphism Layout</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Standardized Playback Control Panel (Play, Pause, Step, Speed Slider)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>SVG/Canvas Renderers for Graphs & Binary Trees</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Module 4 Side-by-Side Synchronized Algorithm Race Arena</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Custom Input Modals & Interactive Preset Controls</span>
            </li>
          </ul>

          <div className="pt-2 text-[11px] font-mono text-cyan-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            Estimated Code Volume: ~2,500 Lines of Modern React & SVG Logic
          </div>
        </div>

        {/* Developer 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">50% Workload</span>
              <h3 className="text-lg font-bold text-white">👨‍💻 Developer 2 – Step Engines & Benchmarking</h3>
            </div>
            <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-extrabold flex items-center justify-center text-sm">
              D2
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Step Generator Functions for all 18 Algorithms</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Module 3 Microsecond Benchmarking Engine & Recharts Analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
              <span>DP Matrix & Backtracking Pathfinding Engines</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Module 5 Complexity Metadata & Pseudocode Implementations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Metrics Collector (Comparisons, Swaps, Memory, Relaxations)</span>
            </li>
          </ul>

          <div className="pt-2 text-[11px] font-mono text-purple-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
            Total Algorithms Maintained: 18 Complete Algorithms
          </div>
        </div>
      </div>

      {/* Recommended 2-Person Branch Architecture */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" /> Recommended Git Repository Structure (2 People)
        </h3>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
          <p className="text-cyan-400">main</p>
          <p className="text-slate-500"> │</p>
          <p className="text-slate-300"> ├── feature/ui-visualizers-comparator (Developer 1)</p>
          <p className="text-slate-300"> └── feature/algorithms-step-benchmark (Developer 2)</p>
          <p className="text-slate-500"> │</p>
          <p className="text-emerald-400"> └── develop (Merge & Integration Branch)</p>
        </div>
      </div>

      {/* 10-Day Schedule Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" /> Restructured 10-Day Roadmap for 2 People
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                <th className="p-3 w-20">Timeline</th>
                <th className="p-3 text-cyan-400">Developer 1 (UI & Visualizers)</th>
                <th className="p-3 text-purple-400">Developer 2 (Engines & Analytics)</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-200">{row.day}</td>
                  <td className="p-3 text-slate-300">{row.p1}</td>
                  <td className="p-3 text-slate-300">{row.p2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
