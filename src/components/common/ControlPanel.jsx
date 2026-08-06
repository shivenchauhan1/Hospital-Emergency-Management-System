import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Sliders, Edit3 } from 'lucide-react';

export default function ControlPanel({
  isPlaying,
  onPlayPause,
  onStepNext,
  onStepPrev,
  onReset,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  onOpenCustomInput
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
      {/* Playback Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          title="Reset Execution"
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onStepPrev}
          disabled={currentStep <= 0}
          title="Previous Step"
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={onPlayPause}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 ${
            isPlaying
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/25'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/25 hover:brightness-110'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Play
            </>
          )}
        </button>

        <button
          onClick={onStepNext}
          disabled={currentStep >= totalSteps - 1}
          title="Next Step"
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Step Progress & Timeline Slider */}
      <div className="flex-1 min-w-[200px] flex items-center gap-3">
        <span className="text-xs font-mono font-semibold text-cyan-400 min-w-[80px]">
          Step {Math.max(0, currentStep + 1)} / {Math.max(1, totalSteps)}
        </span>
        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onStepNext(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Speed Controls & Custom Input */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-medium text-slate-400">Speed:</span>
          <select
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="bg-transparent text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value={0.25} className="bg-slate-900 text-slate-200">0.25x (Slow)</option>
            <option value={0.5} className="bg-slate-900 text-slate-200">0.5x</option>
            <option value={1.0} className="bg-slate-900 text-slate-200">1.0x (Normal)</option>
            <option value={2.0} className="bg-slate-900 text-slate-200">2.0x (Fast)</option>
            <option value={5.0} className="bg-slate-900 text-slate-200">5.0x (Max)</option>
          </select>
        </div>

        {onOpenCustomInput && (
          <button
            onClick={onOpenCustomInput}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            Custom Input
          </button>
        )}
      </div>
    </div>
  );
}
