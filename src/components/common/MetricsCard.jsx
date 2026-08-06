import React from 'react';
import { Clock, Cpu, RefreshCw, Activity, CheckCircle2, Layers } from 'lucide-react';

export default function MetricsCard({ metrics = {} }) {
  const items = [
    {
      label: 'Comparisons / Checks',
      value: metrics.comparisons ?? metrics.relaxations ?? metrics.iterations ?? 0,
      icon: Activity,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Swaps / Movements',
      value: metrics.swaps ?? metrics.rotations ?? metrics.backtracks ?? 0,
      icon: RefreshCw,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: 'Visited / Processed',
      value: metrics.visitedCount ?? (metrics.visitedNodes ? metrics.visitedNodes.length : 0),
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Recursive Calls',
      value: metrics.recursiveCalls ?? metrics.iterations ?? 0,
      icon: Layers,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'Est. Memory Usage',
      value: metrics.memory ? `${metrics.memory} KB` : '~4.2 KB',
      icon: Cpu,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border ${item.bg} backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                {item.label}
              </span>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className={`text-xl font-extrabold font-mono ${item.color}`}>
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
