import React from 'react';

export default function TreeVisualizer({ stepState, algorithmId }) {
  if (!stepState || !stepState.tree) {
    return (
      <div className="w-full h-80 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">
        Empty Tree State
      </div>
    );
  }

  const { tree, visited = [], activeVal, rotationType } = stepState;

  // Flatten tree for SVG coordinates rendering
  const nodesToRender = [];
  const linesToRender = [];

  function calculateLayout(node, x = 340, y = 45, offset = 140) {
    if (!node) return;
    nodesToRender.push({ ...node, x, y });

    if (node.left) {
      const childX = x - offset;
      const childY = y + 55;
      linesToRender.push({ x1: x, y1: y, x2: childX, y2: childY });
      calculateLayout(node.left, childX, childY, offset / 1.8);
    }
    if (node.right) {
      const childX = x + offset;
      const childY = y + 55;
      linesToRender.push({ x1: x, y1: y, x2: childX, y2: childY });
      calculateLayout(node.right, childX, childY, offset / 1.8);
    }
  }

  calculateLayout(tree);

  return (
    <div className="w-full h-80 bg-slate-950/80 border border-slate-800 rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 680 300">
        {/* Render Tree Branch Lines */}
        {linesToRender.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#334155"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}

        {/* Render Tree Nodes */}
        {nodesToRender.map((node, idx) => {
          const isActive = node.val === activeVal;
          const isVisited = visited.includes(node.val);

          let fill = '#1e293b';
          let stroke = '#475569';

          if (isActive) {
            fill = '#ec4899'; // pink-500
            stroke = '#fbcfe8';
          } else if (isVisited) {
            fill = '#10b981'; // emerald-500
            stroke = '#a7f3d0';
          }

          return (
            <g key={idx} className="transition-all duration-300">
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="24"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2"
                  className="animate-ping opacity-75"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r="18"
                fill={fill}
                stroke={stroke}
                strokeWidth="3"
                className="shadow-lg"
              />
              <text
                x={node.x}
                y={node.y + 5}
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {node.val}
              </text>

              {/* AVL Balance Factor Badge */}
              {algorithmId === 'avl' && node.balanceFactor !== undefined && (
                <g>
                  <rect
                    x={node.x - 14}
                    y={node.y - 32}
                    width={28}
                    height={14}
                    rx={3}
                    fill={Math.abs(node.balanceFactor) > 1 ? '#ef4444' : '#0284c7'}
                  />
                  <text
                    x={node.x}
                    y={node.y - 22}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    BF:{node.balanceFactor}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Rotation Status Banner */}
      {rotationType && rotationType !== 'None' && (
        <div className="absolute bottom-3 left-4 bg-pink-500/10 text-pink-400 border border-pink-500/20 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
          Rotation: {rotationType}
        </div>
      )}

      {/* Traversal Order List */}
      {visited.length > 0 && (
        <div className="absolute bottom-3 right-4 bg-slate-900/90 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 max-w-[300px] truncate">
          <span className="text-emerald-400 font-bold">Order:</span>
          <span>[{visited.join(', ')}]</span>
        </div>
      )}
    </div>
  );
}
