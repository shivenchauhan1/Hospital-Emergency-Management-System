import React, { useState } from 'react';
import { Code, Copy, Check, Download } from 'lucide-react';
import { CPP_SOURCE_CODE } from '../../data/shoppingCartData';

export default function CppCodeViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CPP_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([CPP_SOURCE_CODE], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'Shopping_Cart_DSA.cpp';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              C++ Source Code Implementation (PDF Pages 13-17)
            </h3>
            <p className="text-[11px] text-slate-500">
              Complete, production-ready C++ code using std::unordered_map, std::list, std::stack, std::queue, std::priority_queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            {copied ? 'Copied!' : 'Copy C++ Code'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download .cpp
          </button>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {CPP_SOURCE_CODE.split('\n').map((line, idx) => (
          <div key={idx} className="flex gap-4 hover:bg-slate-900/50 px-2 py-0.5 rounded">
            <span className="text-slate-600 w-8 text-right select-none text-[11px]">{idx + 1}</span>
            <span className="whitespace-pre flex-1">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
