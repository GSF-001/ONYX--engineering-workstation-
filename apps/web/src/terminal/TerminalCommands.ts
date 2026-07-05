import { CommandRegistry, type TerminalContext } from "./CommandRegistry";
import { WINDOW_REGISTRY } from "../window-manager";

const APP_IDS = Object.keys(WINDOW_REGISTRY);

/** Registers every built-in terminal command. Matches the command set
 * shown in the mockup's terminal help text (help, dashboard, repo, pr,
 * review, insights, team, report, heatmap, issues, clear, open <app>). */
export function createTerminalRegistry(): CommandRegistry {
  const registry = new CommandRegistry();

  registry.register("help", (_args, ctx) => {
    ctx.print([
      "Available commands:",
      "  help              Show this message",
      "  open <app>        Open an application window",
      "  close <app>       Close an application window",
      "  list              List currently open windows",
      `  ${APP_IDS.join(", ")}   Shortcut to open that app directly`,
      "  status            Show system status",
      "  clear             Clear the terminal",
      "  whoami            Show the signed-in user",
      "  restart           Restart ONYX",
      "  shutdown          Sign out and power off",
    ]);
  });

  registry.register(["open"], (args, ctx) => {
    const appId = args[0];
    if (!appId) {
      ctx.print(["Usage: open <app>. Try `help` for the list of apps."]);
      return;
    }
    if (!APP_IDS.includes(appId)) {
      ctx.print([`Unknown app "${appId}". Try \`help\` for the list of apps.`]);
      return;
    }
    ctx.print([`Opening ${WINDOW_REGISTRY[appId].title}...`]);
    ctx.openApp(appId);
  });

  registry.register(["close"], (args, ctx) => {
    const appId = args[0];
    if (!appId || !APP_IDS.includes(appId)) {
      ctx.print(["Usage: close <app>."]);
      return;
    }
    ctx.closeApp(appId);
    ctx.print([`Closed ${WINDOW_REGISTRY[appId].title}.`]);
  });

  registry.register(["list", "ls"], (_args, ctx) => {
    const open = ctx.listOpenApps();
    ctx.print(open.length > 0 ? open : ["No windows are currently open."]);
  });

  // Direct shortcuts: typing "dashboard" opens Dashboard, same as `open dashboard`.
  for (const appId of APP_IDS) {
    registry.register(appId, (_args, ctx) => {
      ctx.print([`Opening ${WINDOW_REGISTRY[appId].title}...`]);
      ctx.openApp(appId);
    });
  }

  registry.register("status", (_args, ctx) => {
    ctx.print(["System status: OPERATIONAL", "Data stream: LIVE"]);
  });

  registry.register("clear", (_args, ctx) => ctx.clear());

  registry.register("whoami", (_args, ctx) => {
    ctx.print(["Run from inside the app; user identity is shown in the prompt."]);
  });

  registry.register("restart", (_args, ctx) => ctx.navigate("/restart"));
  registry.register("shutdown", (_args, ctx) => ctx.navigate("/shutdown"));

  return registry;
}
