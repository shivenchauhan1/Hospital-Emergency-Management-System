import React, { useState, useEffect, useRef } from 'react';
import { Columns, Play, Pause, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { DEFAULT_SORTING_INPUT, DEFAULT_GRAPH_PRESETS, DEFAULT_TREE_PRESETS } from '../data/defaultInputs';

// Engines
import {
  generateBubbleSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps
} from '../engine/sortingEngine';

import {
  generateDijkstraSteps,
  generateBellmanFordSteps,
  generatePrimSteps,
  generateKruskalSteps
} from '../engine/graphEngine';

import { generateBSTSteps, generateAVLSteps } from '../engine/treeEngine';

import SortingVisualizer from '../components/visualizers/SortingVisualizer';
import GraphVisualizer from '../components/visualizers/GraphVisualizer';
import TreeVisualizer from '../components/visualizers/TreeVisualizer';
import Scorecard from '../components/compare/Scorecard';

export default function ComparePage() {
  const [matchupPreset, setMatchupPreset] = useState('sorting_3way');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  // Compute step streams for side-by-side algorithms based on matchup
  const { algoLeft, algoRight, algoMiddle } = React.useMemo(() => {
    if (matchupPreset === 'sorting_3way') {
      return {
        algoLeft: { id: 'bubble', name: 'Bubble Sort', steps: generateBubbleSortSteps(DEFAULT_SORTING_INPUT), type: 'sorting' },
        algoMiddle: { id: 'merge', name: 'Merge Sort', steps: generateMergeSortSteps(DEFAULT_SORTING_INPUT), type: 'sorting' },
        algoRight: { id: 'quick', name: 'Quick Sort', steps: generateQuickSortSteps(DEFAULT_SORTING_INPUT), type: 'sorting' }
      };
    }
    if (matchupPreset === 'shortest_path') {
      return {
        algoLeft: { id: 'dijkstra', name: "Dijkstra's Algorithm", steps: generateDijkstraSteps(DEFAULT_GRAPH_PRESETS.default, 'A'), type: 'graph' },
        algoMiddle: null,
        algoRight: { id: 'bellman_ford', name: 'Bellman–Ford Algorithm', steps: generateBellmanFordSteps(DEFAULT_GRAPH_PRESETS.default, 'A'), type: 'graph' }
      };
    }
    if (matchupPreset === 'mst') {
      return {
        algoLeft: { id: 'prim', name: "Prim's MST", steps: generatePrimSteps(DEFAULT_GRAPH_PRESETS.default, 'A'), type: 'graph' },
        algoMiddle: null,
        algoRight: { id: 'kruskal', name: "Kruskal's MST", steps: generateKruskalSteps(DEFAULT_GRAPH_PRESETS.default), type: 'graph' }
      };
    }
    // Trees
    return {
      algoLeft: { id: 'bst', name: 'Binary Search Tree (BST)', steps: generateBSTSteps(DEFAULT_TREE_PRESETS.bst), type: 'tree' },
      algoMiddle: null,
      algoRight: { id: 'avl', name: 'AVL Tree (Self-Balancing)', steps: generateAVLSteps(DEFAULT_TREE_PRESETS.avl), type: 'tree' }
    };
  }, [matchupPreset]);

  const maxSteps = Math.max(
    algoLeft?.steps.length || 0,
    algoRight?.steps.length || 0,
    algoMiddle?.steps.length || 0
  );

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, maxSteps]);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [matchupPreset]);

  // Compute final scorecard stats
  const scorecardResults = React.useMemo(() => {
    const list = [];
    if (algoLeft) {
      const last = algoLeft.steps[algoLeft.steps.length - 1] || {};
      list.push({
        id: algoLeft.id,
        name: algoLeft.name,
        comparisons: last.comparisons ?? last.relaxations ?? last.iterations ?? 0,
        swaps: last.swaps ?? last.rotations ?? 0,
        totalSteps: algoLeft.steps.length
      });
    }
    if (algoMiddle) {
      const last = algoMiddle.steps[algoMiddle.steps.length - 1] || {};
      list.push({
        id: algoMiddle.id,
        name: algoMiddle.name,
        comparisons: last.comparisons ?? last.relaxations ?? last.iterations ?? 0,
        swaps: last.swaps ?? last.rotations ?? 0,
        totalSteps: algoMiddle.steps.length
      });
    }
    if (algoRight) {
      const last = algoRight.steps[algoRight.steps.length - 1] || {};
      list.push({
        id: algoRight.id,
        name: algoRight.name,
        comparisons: last.comparisons ?? last.relaxations ?? last.iterations ?? 0,
        swaps: last.swaps ?? last.rotations ?? 0,
        totalSteps: algoRight.steps.length
      });
    }
    return list;
  }, [algoLeft, algoMiddle, algoRight]);

  const renderVisualizerBox = (algo) => {
    if (!algo) return null;
    const stepIdx = Math.min(currentStep, algo.steps.length - 1);
    const stepState = algo.steps[stepIdx] || {};

    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white">{algo.name}</h3>
          <span className="text-[11px] font-mono text-cyan-400">
            Step {stepIdx + 1} / {algo.steps.length}
          </span>
        </div>

        <div className="flex-1">
          {algo.type === 'sorting' && <SortingVisualizer stepState={stepState} />}
          {algo.type === 'graph' && <GraphVisualizer graphData={DEFAULT_GRAPH_PRESETS.default} stepState={stepState} algorithmId={algo.id} />}
          {algo.type === 'tree' && <TreeVisualizer stepState={stepState} algorithmId={algo.id} />}
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
          <span>Ops: {(stepState.comparisons ?? stepState.relaxations ?? stepState.iterations ?? 0) + (stepState.swaps ?? 0)}</span>
          <span className="text-cyan-400 truncate max-w-[200px]">{stepState.message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header & Matchup Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Columns className="w-3.5 h-3.5" />
          Module 4 • Side-by-Side Comparator
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Algorithm Race Arena
        </h1>
        <p className="text-slate-400 text-xs lg:text-sm max-w-3xl leading-relaxed">
          Run 2 or 3 algorithms simultaneously on identical inputs in real-time. Compare step execution counts, operations, and algorithmic efficiency head-to-head.
        </p>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setMatchupPreset('sorting_3way')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              matchupPreset === 'sorting_3way' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Bubble vs Merge vs Quick
          </button>

          <button
            onClick={() => setMatchupPreset('shortest_path')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              matchupPreset === 'shortest_path' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Dijkstra vs Bellman–Ford
          </button>

          <button
            onClick={() => setMatchupPreset('mst')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              matchupPreset === 'mst' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Prim vs Kruskal (MST)
          </button>

          <button
            onClick={() => setMatchupPreset('trees')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              matchupPreset === 'trees' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            BST vs AVL Tree
          </button>
        </div>
      </div>

      {/* Global Synchronized Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Race' : 'Start Synchronized Race'}
          </button>
        </div>

        <span className="text-xs font-mono font-semibold text-cyan-400">
          Sync Step: {currentStep + 1} / {maxSteps}
        </span>
      </div>

      {/* Side-by-Side Visualizers Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderVisualizerBox(algoLeft)}
        {algoMiddle && renderVisualizerBox(algoMiddle)}
        {renderVisualizerBox(algoRight)}
      </div>

      {/* Comparison Scorecard */}
      <Scorecard results={scorecardResults} />
    </div>
  );
}
