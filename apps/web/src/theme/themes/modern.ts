import { PALETTE } from "../palette";
import { FONT_FAMILIES } from "../typography";
import type { Theme } from "../tokens";

/** "Modern Light" — flatter, lighter chrome for people who find the
 * retro look charming for five minutes and then want to actually work. */
export const modernTheme: Theme = {
  id: "modern",
  label: "Modern Light",
  colors: {
    titleBarActive: PALETTE.slate900,
    titleBarInactive: PALETTE.slate400,
    titleBarText: PALETTE.white,
    titleBarTextInactive: PALETTE.slate100,
    windowFace: PALETTE.slate50,
    windowFaceLight: PALETTE.white,
    windowFaceDark: PALETTE.slate200,
    windowBorder: PALETTE.slate200,
    desktopBackground: PALETTE.slate100,
    fieldBackground: PALETTE.white,
    text: PALETTE.slate900,
    textDim: PALETTE.slate600,
    accent: PALETTE.blue600,
    success: PALETTE.success,
    warning: PALETTE.warning,
    danger: PALETTE.danger,
  },
  fonts: { ui: `"Inter", ${FONT_FAMILIES.ui}`, mono: `"JetBrains Mono", ${FONT_FAMILIES.mono}` },
  radius: 6,
};
