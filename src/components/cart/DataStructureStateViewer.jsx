import React from 'react';
import { Database, GitCommit, Layers, Users, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';

export default function DataStructureStateViewer({ engine }) {
  if (!engine) return null;

  const catalogEntries = Array.from(engine.catalog.entries());
  const cartItems = engine.cart;
  const undoStack = engine.undoStack;
  const redoStack = engine.redoStack;
  const queue = engine.checkoutQueue;
  const discounts = engine.discounts;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          Real-Time Data Structure State Viewer ("Behind the Scenes")
        </h3>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          5 Core DSA Engine Live Synchronization
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. HASHMAP (Product Catalog) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Database className="w-3.5 h-3.5" />
              Hashmap (Catalog)
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
              O(1) Lookup
            </span>
          </div>

          <div className="space-y-1 text-[11px] font-mono max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            {catalogEntries.map(([id, prod]) => (
              <div key={id} className="flex items-center justify-between p-1.5 rounded bg-slate-950/80 border border-slate-800/80">
                <span className="text-amber-300 font-bold">ID: {id}</span>
                <span className="text-slate-200 truncate max-w-[80px]">{prod.name}</span>
                <span className="text-slate-400">₹{prod.price}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 italic">unordered_map&lt;int, Product&gt;</p>
        </div>

        {/* 2. LINKED LIST (Shopping Cart) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
              <GitCommit className="w-3.5 h-3.5" />
              Linked List (Cart)
            </div>
            <span className="text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
              Dynamic Node List
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            {cartItems.length === 0 ? (
              <p className="text-slate-500 text-center py-4 italic">(Cart is empty)</p>
            ) : (
              cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                  <span className="font-bold">Node #{idx + 1}</span>
                  <span className="truncate max-w-[90px]">{item.product.name} ×{item.quantity}</span>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] text-slate-500 italic">list&lt;CartItem&gt; (Head → Tail)</p>
        </div>

        {/* 3. UNDO & REDO STACKS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <Layers className="w-3.5 h-3.5" />
              Undo/Redo Stacks
            </div>
            <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
              LIFO History
            </span>
          </div>

          <div className="space-y-2 text-[11px] font-mono max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <div>
              <span className="text-[10px] text-rose-400 font-bold block mb-1">Undo Stack (Top → Down):</span>
              {undoStack.length === 0 ? (
                <p className="text-slate-600 italic">(empty)</p>
              ) : (
                undoStack.slice().reverse().map((act, idx) => (
                  <div key={idx} className="p-1 rounded bg-rose-950/40 border border-rose-500/30 text-rose-200 mb-1">
                    {idx === 0 && <span className="text-amber-400 font-bold mr-1">[TOP]</span>}
                    {act.type}: {act.item.product.name}
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="text-[10px] text-slate-500 italic">stack&lt;Action&gt; (Rollback/Reapply)</p>
        </div>

        {/* 4. CHECKOUT QUEUE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Users className="w-3.5 h-3.5" />
              Checkout Queue
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              FIFO Queue
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            {queue.length === 0 ? (
              <p className="text-slate-500 text-center py-4 italic">(Queue is empty)</p>
            ) : (
              queue.map((cust, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                  <span className="font-bold">{idx === 0 ? '[FRONT]' : `Pos #${idx + 1}`}</span>
                  <span className="font-semibold">{cust}</span>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] text-slate-500 italic">queue&lt;string&gt; (First In, First Out)</p>
        </div>

        {/* 5. DISCOUNT ENGINE (Max-Heap Priority Queue) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
              <RefreshCw className="w-3.5 h-3.5" />
              Discount Max-Heap
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
              Priority Queue
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            {discounts.length === 0 ? (
              <p className="text-slate-500 text-center py-4 italic">(No discounts added)</p>
            ) : (
              discounts.map((rate, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-200">
                  <span className="font-bold">{idx === 0 ? '🏆 MAX TOP' : `Heap Node #${idx + 1}`}</span>
                  <span className="font-extrabold text-purple-300">{rate}% OFF</span>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] text-slate-500 italic">priority_queue&lt;int&gt; (Max-Heap)</p>
        </div>
      </div>
    </div>
  );
}
