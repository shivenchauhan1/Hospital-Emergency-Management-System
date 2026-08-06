import React, { useState, useMemo } from 'react';
import { ShoppingCartEngine } from '../engine/shoppingCartEngine';
import CartInteractiveApp from '../components/cart/CartInteractiveApp';
import DataStructureStateViewer from '../components/cart/DataStructureStateViewer';
import StateTraceTable from '../components/cart/StateTraceTable';
import ArchitectureDiagram from '../components/cart/ArchitectureDiagram';
import CppCodeViewer from '../components/cart/CppCodeViewer';
import TestCaseRunner from '../components/cart/TestCaseRunner';
import { PRD_DOCUMENT_DATA } from '../data/shoppingCartData';
import { ShoppingBag, GitBranch, Code, ShieldCheck, FileText, Sparkles, Database, Layers, Users, RefreshCw, CheckCircle } from 'lucide-react';

export default function ShoppingCartPage() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const engine = useMemo(() => new ShoppingCartEngine(), []);

  const handleStateChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Real-World Business DSA Project (PDF PRD Showcase)
        </div>

        <h1 className="text-3xl lg:text-5xl font-extrabold text-white">
          Shopping Cart System Visualizer
        </h1>

        <p className="text-slate-400 text-xs lg:text-sm max-w-3xl leading-relaxed">
          Demonstrates practical integration of 5 fundamental Data Structures (Hashmap, Linked List, Stacks, Queue, Priority Queue Max-Heap) in a business e-commerce application.
        </p>

        {/* Sub-Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Live Cart Simulator & DSA Viewer
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'architecture'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Architecture Diagram
          </button>

          <button
            onClick={() => setActiveTab('prd')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prd'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            PRD & Executive Abstract
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'code'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            C++ Source Code
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tests'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Test Cases Suite
          </button>
        </div>
      </div>

      {/* Tab 1: Live Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-8">
          {/* Menu Controls */}
          <CartInteractiveApp engine={engine} onStateChange={handleStateChange} />

          {/* Live Behind the Scenes Data Structures Viewer */}
          <DataStructureStateViewer engine={engine} />

          {/* State Trace Table */}
          <StateTraceTable historyTrace={engine.historyTrace} />
        </div>
      )}

      {/* Tab 2: Architecture Diagram */}
      {activeTab === 'architecture' && <ArchitectureDiagram />}

      {/* Tab 3: PRD & Executive Abstract */}
      {activeTab === 'prd' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
            <h2 className="text-2xl font-extrabold text-white">
              {PRD_DOCUMENT_DATA.title}
            </h2>

            <p className="text-slate-300 text-xs leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {PRD_DOCUMENT_DATA.overview}
            </p>

            {/* DSA Mapping Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                System Features & DSA Mappings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
                      <th className="p-3">System Feature</th>
                      <th className="p-3 text-amber-400">DSA Used</th>
                      <th className="p-3 text-cyan-400">Time Complexity</th>
                      <th className="p-3 text-slate-300">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRD_DOCUMENT_DATA.dsaMapping.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-white">{item.feature}</td>
                        <td className="p-3 font-bold text-amber-300">{item.dsa}</td>
                        <td className="p-3 text-cyan-300">{item.complexity}</td>
                        <td className="p-3 text-slate-300">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Functional Requirements FR1-FR7 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                Functional Requirements (FR1 - FR7)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRD_DOCUMENT_DATA.functionalRequirements.map((fr) => (
                  <div key={fr.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {fr.id}
                    </span>
                    <p className="text-xs text-slate-300">{fr.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: C++ Source Code */}
      {activeTab === 'code' && <CppCodeViewer />}

      {/* Tab 5: Test Cases Suite */}
      {activeTab === 'tests' && <TestCaseRunner />}
    </div>
  );
}
