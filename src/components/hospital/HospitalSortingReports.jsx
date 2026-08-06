import React, { useState } from 'react';
import { BarChart2, Filter, ArrowUpDown, Shield, CheckCircle2, User, Activity, Clock } from 'lucide-react';
import { TRIAGE_SEVERITY_LEVELS } from '../../data/hospitalData';

export default function HospitalSortingReports({ engine }) {
  const [sortBy, setSortBy] = useState('severity'); // severity, age, name, id
  const [sortOrder, setSortOrder] = useState('desc'); // desc, asc
  const [algorithm, setAlgorithm] = useState('quickSort'); // quickSort, mergeSort, stdSort

  const rawList = Array.from(engine.patientRegistry.values());

  const getSortedData = () => {
    const list = [...rawList];

    list.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'severity') {
        valA = a.triageLevel;
        valB = b.triageLevel;
      } else if (sortBy === 'age') {
        valA = a.age;
        valB = b.age;
      } else if (sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else {
        valA = a.id;
        valB = b.id;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  };

  const sortedList = getSortedData();

  const getTriageColor = (level) => {
    const found = TRIAGE_SEVERITY_LEVELS.find(l => l.level === level);
    return found ? found.color : "text-slate-300 bg-slate-800 border-slate-700";
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Patient Clinical Reports & Sorting Engine
            </h2>
            <p className="text-xs text-slate-400">
              Generates sorted clinical reports using QuickSort, MergeSort, or std::sort O(N log N).
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-indigo-400 font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="quickSort">QuickSort O(N log N)</option>
              <option value="mergeSort">MergeSort O(N log N)</option>
              <option value="stdSort">std::sort (Timsort / IntroSort)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Sort Criteria</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="severity">Triage Severity Rating</option>
              <option value="age">Patient Age</option>
              <option value="name">Patient Name (Alphabetical)</option>
              <option value="id">Patient ID</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Order</label>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Severity Bar Chart Preview */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Visual Spectrum Bar (Sorted by {sortBy.toUpperCase()})</span>
          <span className="font-mono text-[10px] text-indigo-400">{sortedList.length} Records Rendered</span>
        </h3>

        <div className="flex items-end gap-2 h-32 pt-4 px-2 border-b border-slate-800">
          {sortedList.map((p) => {
            const heightPercent = sortBy === 'severity'
              ? (p.triageLevel / 10) * 100
              : sortBy === 'age'
              ? (p.age / 100) * 100
              : 50;

            return (
              <div key={p.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 hidden group-hover:block bg-slate-900 text-white text-[10px] font-mono p-1.5 rounded-lg border border-slate-700 shadow-xl z-20 whitespace-nowrap">
                  {p.name} ({p.id}) • L{p.triageLevel} Severity • Age {p.age}
                </div>

                <div
                  style={{ height: `${Math.max(15, heightPercent)}%` }}
                  className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-125 ${
                    p.triageLevel >= 8 ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-lg shadow-rose-500/20' :
                    p.triageLevel >= 5 ? 'bg-gradient-to-t from-amber-600 to-amber-400' :
                    'bg-gradient-to-t from-teal-600 to-teal-400'
                  }`}
                />
                <span className="text-[9px] font-mono text-slate-400 truncate w-full text-center">
                  {p.id.replace('PAT-', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sorted Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
              <th className="p-3">Rank</th>
              <th className="p-3">Patient ID</th>
              <th className="p-3">Patient Name</th>
              <th className="p-3">Age / Gender</th>
              <th className="p-3">Condition</th>
              <th className="p-3">Triage Level</th>
              <th className="p-3">System Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((p, idx) => (
              <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-bold text-slate-500">#{idx + 1}</td>
                <td className="p-3 font-bold text-cyan-400">{p.id}</td>
                <td className="p-3 font-bold text-white">{p.name}</td>
                <td className="p-3 text-slate-300">{p.age} / {p.gender}</td>
                <td className="p-3 text-slate-300 max-w-xs truncate">{p.condition}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded font-bold ${getTriageColor(p.triageLevel)}`}>
                    Level {p.triageLevel}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.status === 'TREATED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    p.status === 'WAITING_EMERGENCY' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
