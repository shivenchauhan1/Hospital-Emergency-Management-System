import React from 'react';
import { Database, Zap, Layers, GitCommit, RotateCcw, ArrowRight, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { TRIAGE_SEVERITY_LEVELS } from '../../data/hospitalData';

export default function HospitalDSAVisualizer({ engine }) {
  // 1. unordered_map data
  const registryArray = Array.from(engine.patientRegistry.values());
  const numBuckets = 8;
  const hashBuckets = Array.from({ length: numBuckets }, () => []);
  
  registryArray.forEach(p => {
    // Simple hash function representation for visual buckets
    let hash = 0;
    for (let i = 0; i < p.id.length; i++) {
      hash = (hash + p.id.charCodeAt(i)) % numBuckets;
    }
    hashBuckets[hash].push(p);
  });

  // 2. priority_queue Heap array
  const emergencyHeap = engine.emergencyQueue;

  // 3. FIFO normal queue
  const normalQueue = engine.normalQueue;

  // 4. Doubly linked list history
  const treatmentHistory = engine.treatmentHistory;

  // 5. Undo Stack
  const undoStack = engine.undoStack;

  const getTriageColor = (level) => {
    const found = TRIAGE_SEVERITY_LEVELS.find(l => l.level === level);
    return found ? found.color : "text-slate-300 bg-slate-800 border-slate-700";
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Live Data Structures Memory State Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual state representation of all 5 fundamental STL data structures powering the hospital engine.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Trace Step #{engine.stepCount}
        </div>
      </div>

      {/* Grid Layout for Data Structures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DS 1: UNORDERED MAP (Hash Table & Buckets) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">1. unordered_map&lt;string, Patient&gt;</h3>
                <p className="text-[10px] text-slate-400">Master Patient Registry (Hash Buckets O(1))</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              {registryArray.length} Records
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {hashBuckets.map((bucket, idx) => (
              <div key={idx} className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-mono text-cyan-400 font-bold flex items-center justify-between">
                  <span>Bucket [{idx}]</span>
                  <span className="text-slate-500">{bucket.length} items</span>
                </div>
                {bucket.length === 0 ? (
                  <div className="text-[10px] text-slate-600 font-mono italic py-1">std::nullptr</div>
                ) : (
                  <div className="space-y-1">
                    {bucket.map(p => (
                      <div key={p.id} className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] space-y-0.5">
                        <div className="font-mono font-bold text-white flex items-center justify-between">
                          <span>{p.id}</span>
                          <span className={`px-1 rounded text-[9px] ${getTriageColor(p.triageLevel)}`}>
                            L{p.triageLevel}
                          </span>
                        </div>
                        <div className="text-slate-300 truncate">{p.name}</div>
                        <div className="text-[9px] text-cyan-400/80 font-mono">{p.status}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DS 2: PRIORITY QUEUE (Max-Heap) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">2. priority_queue&lt;EmergencyPatient&gt;</h3>
                <p className="text-[10px] text-slate-400">Emergency Max-Heap (Sorted by Severity 1-10)</p>
              </div>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              {emergencyHeap.length} Waiting
            </span>
          </div>

          {emergencyHeap.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500 italic">
              Emergency Priority Heap is empty. No critical patients in queue.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Top Element (Highest Priority - Next for Treatment)</span>
                <span>Max Severity First</span>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-950 to-slate-950 border border-rose-500/40 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-slate-950">
                      TOP (L{emergencyHeap[0].triageLevel})
                    </span>
                    <span>{emergencyHeap[0].name}</span>
                    <span className="font-mono text-slate-400 text-[10px]">({emergencyHeap[0].id})</span>
                  </div>
                  <div className="text-[11px] text-rose-300 mt-1 font-mono">
                    Condition: {emergencyHeap[0].condition}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono">Registered</span>
                  <div className="text-xs font-mono text-slate-200">{emergencyHeap[0].registeredAt}</div>
                </div>
              </div>

              {/* Remaining Heap Nodes */}
              <div className="text-[10px] font-mono text-slate-400 font-bold pt-1">
                Subsequent Max-Heap Array Nodes (Index 1 to {emergencyHeap.length - 1}):
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {emergencyHeap.slice(1).map((p, idx) => (
                  <div key={p.id + idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-white text-[11px]">{p.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono">{p.id}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${getTriageColor(p.triageLevel)}`}>
                      L{p.triageLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DS 3: QUEUE (Normal FIFO Queue) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">3. queue&lt;NormalPatient&gt;</h3>
                <p className="text-[10px] text-slate-400">Outpatient FIFO Queue (First-In, First-Out)</p>
              </div>
            </div>
            <span className="text-xs font-mono text-teal-400 font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              {normalQueue.length} In Line
            </span>
          </div>

          {normalQueue.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500 italic">
              Normal Outpatient Queue is empty.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <span className="text-[10px] font-mono text-teal-400 font-bold uppercase shrink-0">
                  FRONT (Next) ➔
                </span>
                {normalQueue.map((p, idx) => (
                  <React.Fragment key={p.id + idx}>
                    <div className={`p-2.5 rounded-2xl border shrink-0 min-w-[120px] space-y-1 ${
                      idx === 0
                        ? 'bg-teal-950/80 border-teal-500/50 shadow-md'
                        : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div className="text-[9px] font-mono font-bold text-slate-400 flex items-center justify-between">
                        <span>Pos #{idx + 1}</span>
                        <span className="text-teal-400">{p.id}</span>
                      </div>
                      <div className="text-xs font-bold text-white truncate">{p.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{p.condition}</div>
                    </div>
                    {idx < normalQueue.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase shrink-0 pl-1">
                  ➔ REAR (Newest)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* DS 4: DOUBLY LINKED LIST (Treatment History Log) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <GitCommit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">4. list&lt;TreatmentRecord&gt;</h3>
                <p className="text-[10px] text-slate-400">Treatment History Log (Doubly Linked List Nodes)</p>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              {treatmentHistory.length} Records
            </span>
          </div>

          {treatmentHistory.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500 italic">
              No treatments performed yet. Treat patients to populate the history list.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {treatmentHistory.map((rec, idx) => (
                <div key={rec.treatmentId + idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{rec.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({rec.id})</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${getTriageColor(rec.triageLevel)}`}>
                          L{rec.triageLevel}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Attending: <strong className="text-slate-200">{rec.doctor}</strong> • Condition: {rec.condition}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {rec.treatedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* DS 5: STACK (Undo Operations LIFO Stack) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">5. stack&lt;UndoAction&gt;</h3>
              <p className="text-[10px] text-slate-400">Operation Audit & Undo Stack (LIFO - Top item reverts first)</p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            Stack Depth: {undoStack.length}
          </span>
        </div>

        {undoStack.length === 0 ? (
          <div className="p-6 text-center bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-500 italic">
            Undo Stack is empty. No operations logged.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {undoStack.slice().reverse().map((act, idx) => (
              <div key={idx} className={`p-3 rounded-2xl border transition-all ${
                idx === 0
                  ? 'bg-amber-950/60 border-amber-500/50 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                  <span className={idx === 0 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}>
                    {idx === 0 ? 'TOP OF STACK ➔' : `Depth #${idx}`}
                  </span>
                  <span className="px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {act.type}
                  </span>
                </div>
                <div className="text-xs font-bold truncate">{act.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
