export function SettingsIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden>
      <circle cx="16" cy="16" r="6" fill="#C0C0C0" stroke="#000" />
      <circle cx="16" cy="16" r="2.4" fill="#404040" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4;
        const x = 16 + Math.cos(angle) * 10;
        const y = 16 + Math.sin(angle) * 10;
        return <rect key={i} x={x - 1.4} y={y - 1.4} width="2.8" height="2.8" fill="#808080" />;
      })}
    </svg>
  );
}
