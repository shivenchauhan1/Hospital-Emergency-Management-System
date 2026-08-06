import React, { useState, useMemo } from 'react';
import { HospitalEngine } from '../engine/hospitalEngine';
import HospitalInteractiveConsole from '../components/hospital/HospitalInteractiveConsole';
import HospitalDSAVisualizer from '../components/hospital/HospitalDSAVisualizer';
import HospitalSortingReports from '../components/hospital/HospitalSortingReports';
import HospitalCppCodeViewer from '../components/hospital/HospitalCppCodeViewer';
import HospitalTestRunner from '../components/hospital/HospitalTestRunner';
import HospitalPRDViewer from '../components/hospital/HospitalPRDViewer';
import StateTraceTable from '../components/cart/StateTraceTable';
import { HeartPulse, Terminal, Activity, BarChart2, Code, ShieldCheck, FileText, Sparkles, RefreshCw } from 'lucide-react';

export default function HospitalPage() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const engine = useMemo(() => new HospitalEngine(), []);

  const handleStateChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-rose-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Real-World Healthcare DSA System (C++ STL Powered)
        </div>

        <h1 className="text-3xl lg:text-5xl font-extrabold text-white flex items-center gap-3">
          <HeartPulse className="w-10 h-10 text-rose-500 animate-pulse" />
          Hospital Emergency Management System
        </h1>

        <p className="text-slate-300 text-xs lg:text-sm max-w-3xl leading-relaxed">
          Demonstrates integration of 6 fundamental C++ STL Data Structures: <strong className="text-cyan-400">unordered_map</strong> (Patient Records), <strong className="text-rose-400">priority_queue Max-Heap</strong> (Emergency Triage), <strong className="text-teal-400">queue</strong> (Outpatient FIFO), <strong className="text-purple-400">list</strong> (Treatment History), <strong className="text-amber-400">stack</strong> (LIFO Undo), and <strong className="text-indigo-400">QuickSort / MergeSort</strong> (Patient Reports).
        </p>

        {/* Sub-Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'simulator'
                ? 'bg-rose-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            CLI Simulator (Options 1-8)
          </button>

          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'visualizer'
                ? 'bg-rose-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            DSA Memory Visualizer
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-rose-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Patient Reports & Sorting
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'code'
                ? 'bg-rose-500 text-slate-950 shadow-md'
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
                ? 'bg-rose-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Test Suite Runner
          </button>

          <button
            onClick={() => setActiveTab('prd')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prd'
                ? 'bg-rose-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            PRD Specification
          </button>
        </div>
      </div>

      {/* Tab 1: Live CLI Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-8">
          <HospitalInteractiveConsole engine={engine} onStateChange={handleStateChange} />
          <HospitalDSAVisualizer engine={engine} />
          <StateTraceTable historyTrace={engine.historyTrace} />
        </div>
      )}

      {/* Tab 2: Visualizer */}
      {activeTab === 'visualizer' && (
        <div className="space-y-8">
          <HospitalDSAVisualizer engine={engine} />
          <StateTraceTable historyTrace={engine.historyTrace} />
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && <HospitalSortingReports engine={engine} />}

      {/* Tab 4: Code */}
      {activeTab === 'code' && <HospitalCppCodeViewer />}

      {/* Tab 5: Test Suite */}
      {activeTab === 'tests' && <HospitalTestRunner />}

      {/* Tab 6: PRD */}
      {activeTab === 'prd' && <HospitalPRDViewer />}
    </div>
  );
}
