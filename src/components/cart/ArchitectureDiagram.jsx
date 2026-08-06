import React from 'react';
import { Database, GitCommit, Layers, Users, RefreshCw, ArrowRight, ArrowLeft, ArrowDown, ArrowUp } from 'lucide-react';

export default function ArchitectureDiagram() {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            System Design Specification (PDF Page 8)
          </span>
          <h3 className="text-lg font-bold text-white">
            Shopping Cart System Architecture Diagram
          </h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          5 Core DSA Integration Flow
        </span>
      </div>

      {/* Visual Architectural Node Graph */}
      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-8">
        {/* Top Layer: Catalog -> Cart -> Checkout Queue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Node 1: Product Catalog */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 space-y-2 relative shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Database className="w-4 h-4" /> Product Catalog
              </span>
              <span className="text-[9px] font-mono bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                Hashmap
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 space-y-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <p>ID: 1 → Laptop</p>
              <p>ID: 2 → Phone</p>
              <p>ID: 3 → Headphones</p>
            </div>
          </div>

          {/* Center Connector */}
          <div className="hidden md:flex flex-col items-center justify-center text-cyan-400 text-xs font-mono">
            <span>Lookup O(1)</span>
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>

          {/* Node 2: Shopping Cart */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/40 space-y-2 relative shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <GitCommit className="w-4 h-4" /> Shopping Cart
              </span>
              <span className="text-[9px] font-mono bg-cyan-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                Linked List
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 space-y-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <p className="text-cyan-300 font-bold">Phone ×1</p>
              <p className="text-cyan-300 font-bold">Headphones ×2</p>
            </div>
          </div>
        </div>

        {/* Middle Layer: Undo Stack, Center Cart, Checkout Queue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Node 3: Undo Stack */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 space-y-2 relative shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Undo Stack
              </span>
              <span className="text-[9px] font-mono bg-rose-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                Stack
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 space-y-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <p className="text-rose-300">Added Headphones</p>
              <p className="text-rose-300">Added Phone</p>
            </div>
          </div>

          {/* Node 4: Undo/Redo Bi-directional arrow */}
          <div className="hidden md:flex flex-col items-center justify-center text-rose-400 text-xs font-mono">
            <span>Undo Last Action</span>
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-rose-400 animate-pulse" />
              <ArrowRight className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <span>Redo Reapply</span>
          </div>

          {/* Node 5: Checkout Queue */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 space-y-2 relative shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Checkout Queue
              </span>
              <span className="text-[9px] font-mono bg-emerald-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                FIFO Queue
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 space-y-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <p className="text-emerald-300 font-bold">Alice (Front)</p>
              <p className="text-emerald-300">Bob</p>
              <p className="text-emerald-300">Charlie</p>
            </div>
          </div>
        </div>

        {/* Bottom Layer: Discount Engine Max-Heap */}
        <div className="flex justify-center">
          <div className="w-full md:w-1/2 p-4 rounded-2xl bg-purple-500/10 border-2 border-purple-500/40 space-y-2 relative shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" /> Discount Engine
              </span>
              <span className="text-[9px] font-mono bg-purple-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                Priority Queue (Max-Heap)
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 space-y-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-around">
              <span className="text-purple-300 font-bold bg-purple-500/20 px-2 py-1 rounded">-20% (Top)</span>
              <span className="text-purple-300 font-semibold bg-purple-500/10 px-2 py-1 rounded">-15%</span>
              <span className="text-purple-300 font-semibold bg-purple-500/10 px-2 py-1 rounded">-10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
