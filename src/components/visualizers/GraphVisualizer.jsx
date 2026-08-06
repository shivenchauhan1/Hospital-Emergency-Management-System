import React from 'react';

export default function GraphVisualizer({ graphData, stepState, algorithmId }) {
  if (!graphData || !stepState) {
    return <div className="p-8 text-center text-slate-500">Initializing Graph Visualizer...</div>;
  }

  // Handle Floyd-Warshall Matrix View separately
  if (algorithmId === 'floyd_warshall' && stepState.matrix) {
    const { matrix, nodesList = [], k, i, j } = stepState;
    return (
      <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 overflow-x-auto shadow-inner flex flex-col items-center">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">
          Floyd–Warshall Distance Matrix (V x V)
        </h4>
        <table className="border-collapse text-xs font-mono">
          <thead>
            <tr>
              <th className="p-2 border border-slate-800 bg-slate-900 text-slate-400">i \ j</th>
              {nodesList.map(nodeId => (
                <th key={nodeId} className={`p-2 border border-slate-800 bg-slate-900 font-bold ${nodeId === j ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300'}`}>
                  {nodeId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rIdx) => {
              const rNode = nodesList[rIdx];
              return (
                <tr key={rIdx}>
                  <td className={`p-2 border border-slate-800 bg-slate-900 font-bold text-center ${rNode === i ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300'}`}>
                    {rNode}
                  </td>
                  {row.map((val, cIdx) => {
                    const cNode = nodesList[cIdx];
                    const isCurrentCell = rNode === i && cNode === j;
                    const isKIntermediate = rNode === k || cNode === k;
                    return (
                      <td
                        key={cIdx}
                        className={`p-3 border border-slate-800 text-center transition-colors font-bold ${
                          isCurrentCell
                            ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-lg animate-pulse'
                            : isKIntermediate
                            ? 'bg-cyan-500/10 text-cyan-300'
                            : val === Infinity
                            ? 'text-slate-600 font-normal'
                            : 'text-slate-200'
                        }`}
                      >
                        {val === Infinity ? '∞' : val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {k && (
          <p className="mt-4 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Intermediate Node k = {k}
          </p>
        )}
      </div>
    );
  }

  const { nodes, edges } = graphData;
  const {
    activeNode,
    visitedNodes = [],
    activeEdge,
    mstEdges = [],
    distances = {}
  } = stepState;

  const nodePosMap = {};
  nodes.forEach(n => nodePosMap[n.id] = { x: n.x, y: n.y });

  return (
    <div className="w-full h-80 bg-slate-950/80 border border-slate-800 rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 680 300">
        {/* Render Edges */}
        {edges.map((edge, idx) => {
          const sourcePos = nodePosMap[edge.source];
          const targetPos = nodePosMap[edge.target];
          if (!sourcePos || !targetPos) return null;

          const isActiveEdge =
            activeEdge &&
            ((activeEdge.source === edge.source && activeEdge.target === edge.target) ||
             (activeEdge.source === edge.target && activeEdge.target === edge.source));

          const isMstEdge = mstEdges.some(
            m => (m.source === edge.source && m.target === edge.target) ||
                 (m.source === edge.target && m.target === edge.source)
          );

          let strokeColor = '#334155'; // slate-700
          let strokeWidth = 2;

          if (isActiveEdge) {
            strokeColor = '#f59e0b'; // amber-500
            strokeWidth = 4;
          } else if (isMstEdge) {
            strokeColor = '#10b981'; // emerald-500
            strokeWidth = 4;
          }

          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2;

          return (
            <g key={idx}>
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {/* Edge Weight Badge */}
              <rect
                x={midX - 12}
                y={midY - 10}
                width={24}
                height={20}
                rx={6}
                fill="#0f172a"
                stroke="#334155"
              />
              <text
                x={midX}
                y={midY + 4}
                fill="#94a3b8"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* Render Nodes */}
        {nodes.map((node) => {
          const isVisited = visitedNodes.includes(node.id);
          const isActive = activeNode === node.id;
          const distVal = distances[node.id];

          let nodeFill = '#1e293b'; // slate-800
          let nodeStroke = '#475569'; // slate-600

          if (isActive) {
            nodeFill = '#06b6d4'; // cyan-500
            nodeStroke = '#a5f3fc';
          } else if (isVisited) {
            nodeFill = '#0d9488'; // teal-600
            nodeStroke = '#2dd4bf';
          }

          return (
            <g key={node.id} className="transition-all duration-300 cursor-pointer">
              {/* Outer Pulse for Active Node */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="26"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  className="animate-ping opacity-75"
                />
              )}
              {/* Main Node Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth="3"
                className="shadow-lg transition-all duration-300"
              />
              {/* Node Label */}
              <text
                x={node.x}
                y={node.y + 5}
                fill="#ffffff"
                fontSize="13"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {node.label}
              </text>

              {/* Distance Tag (Dijkstra/Bellman-Ford) */}
              {distVal !== undefined && (
                <g>
                  <rect
                    x={node.x - 16}
                    y={node.y - 34}
                    width={32}
                    height={16}
                    rx={4}
                    fill="#0284c7"
                  />
                  <text
                    x={node.x}
                    y={node.y - 22}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {distVal === Infinity ? '∞' : distVal}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute top-3 right-4 flex items-center gap-3 text-[11px] font-medium bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300">Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
          <span className="text-slate-300">Visited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-slate-300">Relaxing Edge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">MST Edge</span>
        </div>
      </div>
    </div>
  );
}
