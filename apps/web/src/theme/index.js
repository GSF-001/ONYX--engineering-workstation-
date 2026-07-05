import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { TOKENS, type Theme } from "./tokens";
import { pixelTheme } from "./themes/pixel";
import { crtTheme } from "./themes/crt";
import { modernTheme } from "./themes/modern";

export const THEMES: Record<string, Theme> = {
  pixel: pixelTheme,
  crt: crtTheme,
  modern: modernTheme,
};

const DEFAULT_THEME_ID = "pixel";
const STORAGE_KEY = "onyx.themeId";

interface ThemeContextValue {
  theme: Theme;
  themeId: string;
  setThemeId: (id: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}

/**
 * Applies the active theme as CSS custom properties + a handful of retro
 * chrome utility classes on a <style> tag, so every window-manager/desktop
 * component can just reference `var(--win-face)` or class names like
 * `.win-titlebar` instead of re-deriving colors per component.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME_ID;
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID;
  });

  const theme = THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  const css = useMemo(() => buildThemeCss(theme), [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themeId, setThemeId, themes: Object.values(THEMES) }),
    [theme, themeId]
  );

  return (
    <ThemeContext.Provider value={value}>
      <style>{css}</style>
      {children}
    </ThemeContext.Provider>
  );
}

function buildThemeCss(theme: Theme): string {
  const c = theme.colors;
  const r = theme.radius;

  return `
    :root {
      --win-titlebar-active: ${c.titleBarActive};
      --win-titlebar-inactive: ${c.titleBarInactive};
      --win-titlebar-text: ${c.titleBarText};
      --win-titlebar-text-inactive: ${c.titleBarTextInactive};
      --win-face: ${c.windowFace};
      --win-face-light: ${c.windowFaceLight};
      --win-face-dark: ${c.windowFaceDark};
      --win-border: ${c.windowBorder};
      --win-desktop-bg: ${c.desktopBackground};
      --win-field-bg: ${c.fieldBackground};
      --win-text: ${c.text};
      --win-text-dim: ${c.textDim};
      --win-accent: ${c.accent};
      --win-success: ${c.success};
      --win-warning: ${c.warning};
      --win-danger: ${c.danger};
      --win-font-ui: ${theme.fonts.ui};
      --win-font-mono: ${theme.fonts.mono};
      --win-radius: ${r}px;
      --win-titlebar-h: ${TOKENS.window.titleBarHeight}px;
      --win-menubar-h: ${TOKENS.window.menuBarHeight}px;
      --win-toolbar-h: ${TOKENS.window.toolbarHeight}px;
    }

    .win-desktop {
      background: var(--win-desktop-bg);
      font-family: var(--win-font-ui);
      color: var(--win-text);
      position: relative;
      overflow: hidden;
    }

    .win-frame {
      background: var(--win-face);
      border: 1px solid var(--win-border);
      border-radius: var(--win-radius);
      box-shadow: 2px 2px 0 rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .win-titlebar {
      height: var(--win-titlebar-h);
      background: var(--win-titlebar-active);
      color: var(--win-titlebar-text);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 6px;
      font-size: 12px;
      font-weight: 600;
      user-select: none;
      cursor: default;
    }
    .win-titlebar.inactive {
      background: var(--win-titlebar-inactive);
      color: var(--win-titlebar-text-inactive);
    }

    .win-button {
      width: 18px;
      height: 16px;
      border: 1px solid var(--win-border);
      background: var(--win-face);
      color: var(--win-text);
      font-size: 10px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .win-button:active { transform: translateY(1px); }

    .win-menubar {
      height: var(--win-menubar-h);
      background: var(--win-face);
      border-bottom: 1px solid var(--win-face-dark);
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 0 4px;
    }
    .win-menubar-item {
      padding: 2px 8px;
      cursor: default;
    }
    .win-menubar-item:hover, .win-menubar-item.open {
      background: var(--win-titlebar-active);
      color: var(--win-titlebar-text);
    }

    .win-toolbar {
      height: var(--win-toolbar-h);
      background: var(--win-face-light);
      border-bottom: 1px solid var(--win-face-dark);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 6px;
    }

    .win-body {
      flex: 1;
      background: var(--win-field-bg);
      color: var(--win-text);
      overflow: auto;
      font-size: 13px;
    }

    .win-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: 76px;
      padding: 6px 4px;
      cursor: default;
      user-select: none;
      border-radius: var(--win-radius);
    }
    .win-icon.selected {
      background: rgba(255,255,255,0.15);
      outline: 1px dashed var(--win-titlebar-text);
    }
    .win-icon-label {
      font-size: 11px;
      color: var(--win-titlebar-text);
      text-align: center;
      text-shadow: 0 1px 2px rgba(0,0,0,0.6);
      line-height: 1.2;
    }

    .context-menu {
      background: var(--win-face);
      border: 1px solid var(--win-border);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
      min-width: 180px;
      font-size: 12px;
      padding: 2px;
    }
    .context-menu-item {
      padding: 5px 10px;
      cursor: default;
    }
    .context-menu-item:hover {
      background: var(--win-titlebar-active);
      color: var(--win-titlebar-text);
    }
    .context-menu-divider {
      height: 1px;
      background: var(--win-face-dark);
      margin: 3px 2px;
    }

    .win-toast {
      background: var(--win-face);
      border: 1px solid var(--win-border);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
      padding: 10px 14px;
      font-size: 12px;
      color: var(--win-text);
    }

    ${theme.scanlines ? SCANLINE_OVERLAY_CSS : ""}
  `;
}

const SCANLINE_OVERLAY_CSS = `
  .win-desktop::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0.15) 0px,
      rgba(0,0,0,0.15) 1px,
      transparent 1px,
      transparent 3px
    );
    mix-blend-mode: multiply;
  }
`;

export { TOKENS };
export type { Theme };
