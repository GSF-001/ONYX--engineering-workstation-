import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import { getCurrentUser } from "./shared/api";

/**
 * Enforced flow: landing -> auth -> boot -> desktop.
 *
 * - "landing" is public.
 * - "auth" kicks off the GitHub OAuth redirect; it doesn't render a page
 *   the user lingers on.
 * - "boot", "desktop", "shutdown", and "restart" require a valid session.
 *   Anyone hitting those URLs directly without one is bounced to "landing".
 * - Anyone who already has a session hitting "landing" or "auth" again is
 *   forwarded straight to "boot".
 *
 * Page components live at ./pages/* (thin route-level wrappers) and compose
 * real modules from ./landing, ./boot, ./window-manager, ./taskbar,
 * ./command-palette, ./notifications.
 */

async function requireSession() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    throw redirect("/");
  }
  return user;
}

async function redirectIfAuthenticated() {
  const user = await getCurrentUser().catch(() => null);
  if (user) {
    throw redirect("/boot");
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
        path: "boot",
        loader: requireSession,
        lazy: async () => {
          const { BootScreen } = await import("./boot");
          return { Component: BootScreen };
        },
      },
      {
        path: "desktop",
        loader: requireSession,
        lazy: async () => {
          const { DesktopPage } = await import("./pages/DesktopPage");
          return { Component: DesktopPage };
        },
      },
      {
        path: "shutdown",
        loader: requireSession,
        lazy: async () => {
          const { ShutdownScreen } = await import("./boot");
          return { Component: ShutdownScreen };
        },
      },
      {
        path: "restart",
        loader: requireSession,
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
