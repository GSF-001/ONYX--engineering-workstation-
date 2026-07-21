import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import { getCurrentUser } from "./shared/api";
import { IdentityAPI } from "./identity";

/**
 * Enforced flow: landing -> auth -> boot -> desktop.
 *
 * - "landing" is public. "features" is also public (full feature preview,
 *   linked from landing's teaser grid).
 * - "auth" kicks off the GitHub OAuth redirect; it doesn't render a page
 *   the user lingers on.
 * - "boot", "desktop", "shutdown", and "restart" require a valid session
 *   AND a confirmed identity. Anyone hitting those URLs directly without
 *   one is bounced to "landing" or "identity".
 * - Anyone who already has a session hitting "landing" or "auth" again is
 *   forwarded straight to "boot".
 *
 * Page components live at ./pages/* (thin route-level wrappers) and compose
 * real modules from ./landing, ./boot, ./window-manager, ./taskbar,
 * ./command-palette, ./notifications.
 */

async function requireSession() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) throw redirect("/");
  return user;
}

/** Requires both a valid session AND a confirmed ONYX identity — used for
 * every route past the identity picker (boot, desktop, shutdown, restart). */
async function requireIdentity() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) throw redirect("/");

  const identity = await IdentityAPI.getMe().catch(() => null);
  if (!identity) throw redirect("/identity");

  return { user, identity };
}

async function redirectIfAuthenticated() {
  const user = await getCurrentUser().catch(() => null);
  if (user) {
    const identity = await IdentityAPI.getMe().catch(() => null);
    throw redirect(identity ? "/boot" : "/identity");
  }
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: redirectIfAuthenticated,
        lazy: async () => {
          const { LandingPage } = await import("./landing");
          return { Component: LandingPage };
        },
      },
      {
        path: "features",
        lazy: async () => {
          const { FeaturesPage } = await import("./pages/FeaturesPage");
          return { Component: FeaturesPage };
        },
      },
      {
        path: "auth/github",
        loader: () => {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
          return null;
        },
        lazy: async () => {
          const { RedirectingPage } = await import("./pages/RedirectingPage");
          return { Component: RedirectingPage };
        },
      },
      {
        path: "identity",
        loader: requireSession,
        lazy: async () => {
          const { IdentityPicker } = await import("./identity");
          return { Component: IdentityPicker };
        },
      },
      {
        path: "boot",
        loader: requireIdentity,
        lazy: async () => {
          const { BootScreen } = await import("./boot");
          return { Component: BootScreen };
        },
      },
      {
        path: "desktop",
        loader: requireIdentity,
        lazy: async () => {
          const { DesktopPage } = await import("./pages/DesktopPage");
          return { Component: DesktopPage };
        },
      },
      {
        path: "shutdown",
        loader: requireIdentity,
        lazy: async () => {
          const { ShutdownScreen } = await import("./boot");
          return { Component: ShutdownScreen };
        },
      },
      {
        path: "restart",
        loader: requireIdentity,
        lazy: async () => {
          const { RestartScreen } = await import("./boot");
          return { Component: RestartScreen };
        },
      },
      {
        path: "*",
        lazy: async () => {
          const { NotFoundPage } = await import("./pages/NotFoundPage");
          return { Component: NotFoundPage };
        },
      },
    ],
  },
]);
