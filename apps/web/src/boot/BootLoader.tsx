/** Small pixel-style "old computer" glyph shown next to the boot log,
 * matching the terminal-plus-monitor icon in the reference mockup. */
export function BootLoader() {
  return (
    <svg width="80" height="80" viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden>
      <rect x="4" y="4" width="24" height="16" fill="#C0C0C0" stroke="#000" />
      <rect x="7" y="7" width="18" height="10" fill="#000080" />
      <rect x="9" y="9" width="10" height="2" fill="#33FF66" />
      <rect x="9" y="12" width="14" height="2" fill="#33FF66" />
      <rect x="12" y="22" width="8" height="3" fill="#808080" />
      <rect x="8" y="26" width="16" height="2" fill="#404040" />
    </svg>
  );
}
