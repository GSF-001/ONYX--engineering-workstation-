// MiniMap.tsx
import { useGitGraphLayout, useGitGraphState } from "./GitGraphHooks";
import { selectCommit } from "./GitGraphCommands";

const MAP_WIDTH = 120;
const MAP_HEIGHT = 160;

export default function MiniMap() {
  const layout = useGitGraphLayout();
  const { selectedCommitHash } = useGitGraphState();

  const scaleX = layout.width > 0 ? MAP_WIDTH / layout.width : 1;
  const scaleY = layout.height > 0 ? MAP_HEIGHT / layout.height : 1;
  const scale = Math.min(scaleX, scaleY, 1);

  return (
    <div className="minimap">
      <svg
        className="minimap-svg"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role="img"
        aria-label="Repository overview"
      >
        <g transform={`scale(${scale})`}>
          {layout.edges.map((edge) => (
            <path key={edge.id} d={edge.path} stroke={edge.color} strokeWidth={1.5} fill="none" opacity={0.5} />
          ))}
          {layout.nodes.map((node) => (
            <circle
              key={node.commit.hash}
              cx={node.x}
              cy={node.y}
              r={node.commit.hash === selectedCommitHash ? 4 : 2.5}
              fill={node.color}
              className="minimap-dot"
              onClick={() => selectCommit(node.commit.hash)}
            />
          ))}
        </g>
      </svg>
      <span className="minimap-label">{layout.nodes.length} commits</span>
    </div>
  );
}
