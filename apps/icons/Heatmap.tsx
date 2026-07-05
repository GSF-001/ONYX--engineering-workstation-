export function HeatmapIcon() {
  const cells = [0.9, 0.2, 0.5, 0.1, 0.7, 0.3, 0.9, 0.4, 0.1, 0.6, 0.8, 0.2, 0.3, 0.9, 0.5, 0.1];
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden>
      <rect x="4" y="4" width="24" height="24" fill="#1a1a2e" stroke="#000" />
      {cells.map((v, i) => (
        <rect
          key={i}
          x={6 + (i % 4) * 5}
          y={6 + Math.floor(i / 4) * 5}
          width="4"
          height="4"
          fill={`rgba(79,209,174,${v})`}
        />
      ))}
    </svg>
  );
}
