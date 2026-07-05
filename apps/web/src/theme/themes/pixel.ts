import { PALETTE } from "../palette";
import { FONT_FAMILIES } from "../typography";
import type { Theme } from "../tokens";

/**
 * "Retro Default" — the Windows-95-esque navy/silver/cream theme that
 * matches the primary product mockups.
 */
export const pixelTheme: Theme = {
  id: "pixel",
  label: "Retro Default",
  colors: {
    titleBarActive: PALETTE.navy,
    titleBarInactive: PALETTE.silverDark,
    titleBarText: PALETTE.white,
    titleBarTextInactive: PALETTE.silverLight,
    windowFace: PALETTE.silver,
    windowFaceLight: PALETTE.silverLight,
    windowFaceDark: PALETTE.silverDark,
    windowBorder: PALETTE.black,
    desktopBackground: PALETTE.teal,
    fieldBackground: PALETTE.cream,
    text: PALETTE.black,
    textDim: "#4a4a4a",
    accent: PALETTE.orange,
    success: PALETTE.success,
    warning: PALETTE.warning,
    danger: PALETTE.danger,
  },
  fonts: { ui: FONT_FAMILIES.ui, mono: FONT_FAMILIES.mono },
  radius: 0,
};
