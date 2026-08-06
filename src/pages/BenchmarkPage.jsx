import React, { useState, useMemo } from 'react';
import { BarChart3, Zap, Cpu, RefreshCw, Sliders } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, BarChart, Bar } from 'recharts';
import { benchmarkSortingAlgorithms } from '../engine/benchmarkEngine';

export default function BenchmarkPage() {
  const [distribution, setDistribution] = useState('random');
  const [sizePreset, setSizePreset] = useState([10, 50, 100, 200]);

  const benchmarkData = useMemo(() => {
    return benchmarkSortingAlgorithms(sizePreset, distribution);
  }, [sizePreset, distribution]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <BarChart3 className="w-3.5 h-3.5" />
          Module 3 • Performance Analytics Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Algorithm Benchmarking Suite
        </h1>
        <p className="text-slate-400 text-xs lg:text-sm max-w-3xl leading-relaxed">
          Evaluate microsecond execution times, comparison counts, and memory growth rates across varied dataset sizes ($N$) and data distributions (Random, Sorted, Reverse Sorted).
        </p>

        {/* Distribution Filter & Presets */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold px-2">Distribution:</span>
            {['random', 'sorted', 'reverse'].map((type) => (
              <button
                key={type}
                onClick={() => setDistribution(type)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                  distribution === type
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold px-2">Sizes (N):</span>
            <button
              onClick={() => setSizePreset([10, 50, 100, 200])}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                sizePreset[sizePreset.length - 1] === 200
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Small (10-200)
            </button>
            <button
              onClick={() => setSizePreset([50, 100, 250, 500])}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                sizePreset[sizePreset.length - 1] === 500
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Medium (50-500)
            </button>
          </div>
        </div>
      </div>

      {/* Chart Grid: Execution Time & Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Time Line Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Execution Time vs Input Size (N)
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Milliseconds (ms)</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="size" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Bubble" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Insertion" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Merge" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Quick" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Heap" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparisons Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              Total Operations Count (Comparisons)
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Log Scale Ops</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="size" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="BubbleComps" name="Bubble Ops" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MergeComps" name="Merge Ops" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="QuickComps" name="Quick Ops" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Detailed Benchmark Metrics Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3">Input Size (N)</th>
                <th className="p-3 text-amber-400">Bubble Sort</th>
                <th className="p-3 text-pink-400">Insertion Sort</th>
                <th className="p-3 text-emerald-400">Merge Sort</th>
                <th className="p-3 text-cyan-400">Quick Sort</th>
                <th className="p-3 text-purple-400">Heap Sort</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-200">N = {row.size}</td>
                  <td className="p-3 text-amber-300">{row.Bubble} ms ({row.BubbleComps} ops)</td>
                  <td className="p-3 text-pink-300">{row.Insertion} ms ({row.InsertionComps} ops)</td>
                  <td className="p-3 text-emerald-300">{row.Merge} ms ({row.MergeComps} ops)</td>
                  <td className="p-3 text-cyan-300">{row.Quick} ms ({row.QuickComps} ops)</td>
                  <td className="p-3 text-purple-300">{row.Heap} ms ({row.HeapComps} ops)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
