import type { PALETTE } from "./palette";
import type { FONT_FAMILIES } from "./typography";

/** Non-color, non-font structural constants shared by every theme. */
export const TOKENS = {
  spacing: { 0: 0, 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 24, 7: 32, 8: 48 },
  window: {
    minWidth: 320,
    minHeight: 220,
    titleBarHeight: 28,
    menuBarHeight: 24,
    toolbarHeight: 32,
    defaultWidth: 640,
    defaultHeight: 460,
  },
  desktop: {
    iconSize: 48,
    iconGridGap: 16,
    taskbarHeight: 32,
  },
  zIndex: {
    desktop: 0,
    windowBase: 100,
    contextMenu: 5000,
    toast: 6000,
    boot: 9000,
  },
  transition: {
    fast: "120ms ease",
    normal: "220ms ease",
    slow: "400ms ease",
  },
} as const;

export type ColorTokens = {
  titleBarActive: string;
  titleBarInactive: string;
  titleBarText: string;
  titleBarTextInactive: string;
  windowFace: string;
  windowFaceLight: string;
  windowFaceDark: string;
  windowBorder: string;
  desktopBackground: string;
  fieldBackground: string;
  text: string;
  textDim: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
};

export interface Theme {
  id: string;
  label: string;
  colors: ColorTokens;
  fonts: { ui: string; mono: string };
  radius: number;
  scanlines?: boolean;
}

export type { PALETTE, FONT_FAMILIES };
