import React, { useState, useEffect, useRef } from 'react';
import { ALGORITHMS_DATA } from '../data/algorithmsData';
import {
  DEFAULT_SORTING_INPUT,
  DEFAULT_GRAPH_PRESETS,
  DEFAULT_TREE_PRESETS,
  DEFAULT_DP_INPUTS,
  DEFAULT_SUDOKU_BOARD_4X4,
  DEFAULT_MAZE_GRID_8X8
} from '../data/defaultInputs';

// Engines
import {
  generateBubbleSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps
} from '../engine/sortingEngine';

import {
  generateBFSSteps,
  generateDFSSteps,
  generateDijkstraSteps,
  generateFloydWarshallSteps,
  generatePrimSteps,
  generateKruskalSteps,
  generateBellmanFordSteps
} from '../engine/graphEngine';

import { generateBSTSteps, generateAVLSteps } from '../engine/treeEngine';
import { generateKnapsackSteps, generateLCSSteps } from '../engine/dpEngine';
import { generateSudokuSteps, generateRatInMazeSteps } from '../engine/backtrackingEngine';

// Components
import ControlPanel from '../components/common/ControlPanel';
import MetricsCard from '../components/common/MetricsCard';
import CodeViewer from '../components/common/CodeViewer';

import SortingVisualizer from '../components/visualizers/SortingVisualizer';
import GraphVisualizer from '../components/visualizers/GraphVisualizer';
import TreeVisualizer from '../components/visualizers/TreeVisualizer';
import DPVisualizer from '../components/visualizers/DPVisualizer';
import BacktrackingVisualizer from '../components/visualizers/BacktrackingVisualizer';

export default function VisualizerPage({ selectedAlgorithm, setSelectedAlgorithm }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  // Custom data states
  const [sortingData, setSortingData] = useState(DEFAULT_SORTING_INPUT);
  const [graphData, setGraphData] = useState(DEFAULT_GRAPH_PRESETS.default);
  const [treeData, setTreeData] = useState(DEFAULT_TREE_PRESETS.bst);

  const timerRef = useRef(null);

  const algoMeta = ALGORITHMS_DATA[selectedAlgorithm] || ALGORITHMS_DATA.bubble;

  // Generate steps dynamically based on selected algorithm and current input data
  const steps = React.useMemo(() => {
    switch (selectedAlgorithm) {
      // Sorting
      case 'bubble': return generateBubbleSortSteps(sortingData);
      case 'insertion': return generateInsertionSortSteps(sortingData);
      case 'merge': return generateMergeSortSteps(sortingData);
      case 'quick': return generateQuickSortSteps(sortingData);
      case 'heap': return generateHeapSortSteps(sortingData);

      // Graph
      case 'bfs': return generateBFSSteps(graphData, graphData.startNode);
      case 'dfs': return generateDFSSteps(graphData, graphData.startNode);
      case 'dijkstra': return generateDijkstraSteps(graphData, graphData.startNode);
      case 'floyd_warshall': return generateFloydWarshallSteps(graphData);
      case 'prim': return generatePrimSteps(graphData, graphData.startNode);
      case 'kruskal': return generateKruskalSteps(graphData);
      case 'bellman_ford': return generateBellmanFordSteps(graphData, graphData.startNode);

      // Tree
      case 'bst': return generateBSTSteps(treeData, 'inorder');
      case 'avl': return generateAVLSteps(DEFAULT_TREE_PRESETS.avl);

      // DP
      case 'knapsack': return generateKnapsackSteps(DEFAULT_DP_INPUTS.knapsack.items, DEFAULT_DP_INPUTS.knapsack.capacity);
      case 'lcs': return generateLCSSteps(DEFAULT_DP_INPUTS.lcs.str1, DEFAULT_DP_INPUTS.lcs.str2);

      // Backtracking
      case 'sudoku': return generateSudokuSteps(DEFAULT_SUDOKU_BOARD_4X4);
      case 'rat_in_maze': return generateRatInMazeSteps(DEFAULT_MAZE_GRID_8X8);

      default: return generateBubbleSortSteps(sortingData);
    }
  }, [selectedAlgorithm, sortingData, graphData, treeData]);

  // Handle Play/Pause Auto Timer
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(100, Math.round(800 / speed));
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, steps.length]);

  // Reset step when algorithm changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [selectedAlgorithm]);

  const stepState = steps[currentStep] || steps[0] || {};

  const handleApplyCustomInput = () => {
    if (algoMeta.category === 'sorting') {
      const parsed = customInputText
        .split(',')
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => !isNaN(n) && n > 0 && n <= 999);

      if (parsed.length >= 3) {
        setSortingData(parsed);
        setCurrentStep(0);
        setIsPlaying(false);
      }
    } else if (algoMeta.category === 'tree') {
      const parsed = customInputText
        .split(',')
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => !isNaN(n));

      if (parsed.length >= 2) {
        setTreeData(parsed);
        setCurrentStep(0);
        setIsPlaying(false);
      }
    }
    setShowCustomModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Header & Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            Module 2 • Visualizer Engine
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {algoMeta.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Select Algorithm:</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-inner"
          >
            {Object.values(ALGORITHMS_DATA).map((algo) => (
              <option key={algo.id} value={algo.id}>
                [{algo.categoryName}] {algo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Banner */}
      <MetricsCard metrics={stepState} />

      {/* Main Split Content: Visualizer Canvas (Left) & Pseudocode Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Visualizer Renderer Component */}
          {algoMeta.category === 'sorting' && <SortingVisualizer stepState={stepState} />}
          {algoMeta.category === 'graph' && <GraphVisualizer graphData={graphData} stepState={stepState} algorithmId={selectedAlgorithm} />}
          {algoMeta.category === 'tree' && <TreeVisualizer stepState={stepState} algorithmId={selectedAlgorithm} />}
          {algoMeta.category === 'dp' && <DPVisualizer stepState={stepState} algorithmId={selectedAlgorithm} />}
          {algoMeta.category === 'backtracking' && <BacktrackingVisualizer stepState={stepState} algorithmId={selectedAlgorithm} />}

          {/* Control Bar */}
          <ControlPanel
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onStepNext={(stepIdx) => {
              if (typeof stepIdx === 'number') setCurrentStep(stepIdx);
              else setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
            }}
            onStepPrev={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            onReset={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            currentStep={currentStep}
            totalSteps={steps.length}
            speed={speed}
            onSpeedChange={(s) => setSpeed(s)}
            onOpenCustomInput={() => {
              setCustomInputText(
                algoMeta.category === 'sorting'
                  ? sortingData.join(', ')
                  : treeData.join(', ')
              );
              setShowCustomModal(true);
            }}
          />
        </div>

        {/* Right Sidebar: Pseudocode Viewer */}
        <div className="lg:col-span-1 h-[460px]">
          <CodeViewer
            pseudocode={algoMeta.pseudocode}
            activeLine={stepState.line}
            message={stepState.message}
          />
        </div>
      </div>

      {/* Custom Input Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Custom Input Values</h3>
            <p className="text-xs text-slate-400">
              Enter comma-separated numbers (e.g. 50, 20, 85, 10, 45):
            </p>
            <textarea
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomInput}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md"
              >
                Apply & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
