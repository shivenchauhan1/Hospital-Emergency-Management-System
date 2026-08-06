import React from 'react';
import { HOSPITAL_PRD_DOCUMENT } from '../../data/hospitalData';
import { FileText, Database, GitBranch, Shield, Sparkles, CheckCircle } from 'lucide-react';

export default function HospitalPRDViewer() {
  const doc = HOSPITAL_PRD_DOCUMENT;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-8">
      {/* Document Header */}
      <div className="space-y-4 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          {doc.version}
        </div>

        <h2 className="text-2xl lg:text-4xl font-extrabold text-white">
          {doc.title}
        </h2>

        <p className="text-slate-300 text-xs lg:text-sm leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
          {doc.abstract}
        </p>
      </div>

      {/* DSA Mapping Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4" />
          Data Structures & Systems Mapping Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
                <th className="p-3">System Feature</th>
                <th className="p-3 text-amber-400">STL Data Structure Used</th>
                <th className="p-3 text-cyan-400">Time Complexity</th>
                <th className="p-3 text-slate-300">Technical Description</th>
              </tr>
            </thead>
            <tbody>
              {doc.dsaMapping.map((item, idx) => (
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

      {/* Functional Requirements Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Functional Requirements (FR1 - FR8)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doc.requirements.map((fr) => (
            <div key={fr.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                {fr.id}
              </span>
              <div>
                <div className="text-xs font-bold text-white mb-0.5">{fr.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{fr.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
