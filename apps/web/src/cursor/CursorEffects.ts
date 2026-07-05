/** Spawns a short-lived expanding ring at (x, y) on click — a subtle
 * "this registered" affordance, auto-removed after its animation ends. */
export function spawnClickRipple(x: number, y: number): void {
  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.left = `${x - 8}px`;
  el.style.top = `${y - 8}px`;
  el.style.width = "16px";
  el.style.height = "16px";
  el.style.borderRadius = "50%";
  el.style.border = "1px solid var(--win-accent, #4fd1ae)";
  el.style.pointerEvents = "none";
  el.style.zIndex = "99999";
  el.style.transition = "transform 300ms ease, opacity 300ms ease";
  el.style.transform = "scale(0.5)";
  el.style.opacity = "0.8";

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = "scale(2)";
    el.style.opacity = "0";
  });

  setTimeout(() => el.remove(), 320);
}

export function attachClickRippleListener(): () => void {
  const handler = (e: MouseEvent) => spawnClickRipple(e.clientX, e.clientY);
  window.addEventListener("click", handler);
  return () => window.removeEventListener("click", handler);
}
