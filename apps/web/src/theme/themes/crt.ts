import { PALETTE } from "../palette";
import { FONT_FAMILIES } from "../typography";
import type { Theme } from "../tokens";

/** "CRT Green" — phosphor-on-black terminal aesthetic, scanlines on. */
export const crtTheme: Theme = {
  id: "crt",
  label: "CRT Green",
  colors: {
    titleBarActive: PALETTE.crtGreenDim,
    titleBarInactive: "#0A2015",
    titleBarText: PALETTE.crtGreen,
    titleBarTextInactive: "#1f6b3a",
    windowFace: PALETTE.crtBlack,
    windowFaceLight: "#0A2015",
    windowFaceDark: "#000000",
    windowBorder: PALETTE.crtGreen,
    desktopBackground: "#010A05",
    fieldBackground: "#04150A",
    text: PALETTE.crtGreen,
    textDim: PALETTE.crtGreenDim,
    accent: PALETTE.crtAmber,
    success: PALETTE.crtGreen,
    warning: PALETTE.crtAmber,
    danger: "#FF5C5C",
  },
  fonts: { ui: FONT_FAMILIES.mono, mono: FONT_FAMILIES.mono },
  radius: 0,
  scanlines: true,
};
