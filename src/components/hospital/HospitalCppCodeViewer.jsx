import React, { useState } from 'react';
import { CPP_HOSPITAL_CODE } from '../../data/hospitalData';
import { Code, Copy, Check, Download, FileCode, Terminal } from 'lucide-react';

export default function HospitalCppCodeViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CPP_HOSPITAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([CPP_HOSPITAL_CODE], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "HospitalEmergencySystem.cpp";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const lines = CPP_HOSPITAL_CODE.trim().split('\n');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              C++ STL Source Code Implementation
              <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Compilable C++17 / C++20
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean C++ implementation using std::unordered_map, std::priority_queue, std::queue, std::list, std::stack, and std::sort.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                Copy C++ Source Code
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            Download .cpp File
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden font-mono text-xs shadow-inner">
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>HospitalEmergencySystem.cpp</span>
          </div>
          <span>{lines.length} lines • g++ -std=c++17 HospitalEmergencySystem.cpp -o hospital</span>
        </div>

        <div className="p-4 max-h-[500px] overflow-y-auto space-y-0.5 leading-relaxed">
          {lines.map((line, idx) => (
            <div key={idx} className="flex hover:bg-slate-900/60 rounded px-1 transition-colors">
              <span className="w-10 text-right pr-4 text-slate-600 select-none text-[11px]">
                {idx + 1}
              </span>
              <span className={`flex-1 whitespace-pre ${
                line.startsWith('//') ? 'text-slate-500 italic' :
                line.includes('#include') ? 'text-rose-400 font-bold' :
                line.includes('class ') || line.includes('struct ') ? 'text-cyan-300 font-bold' :
                line.includes('unordered_map') || line.includes('priority_queue') || line.includes('queue') || line.includes('list') || line.includes('stack') ? 'text-amber-300 font-bold' :
                'text-slate-200'
              }`}>
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
