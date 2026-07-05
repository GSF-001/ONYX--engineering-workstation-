import { WindowHeader } from "./WindowHeader";
import { WindowButtons } from "./WindowButtons";
import { WindowBody } from "./WindowBody";
import { MenuBar, defaultWindowMenus } from "./MenuBar";
import { Resizable } from "./Resizable";
import type { WindowInstance } from "./WindowContext";
import { WINDOW_REGISTRY } from "./WindowRegistry";
import { useWindowManager } from "./useWindow";

interface WindowFrameProps {
  instance: WindowInstance;
}

export function WindowFrame({ instance }: WindowFrameProps) {
  const manager = useWindowManager();
  const def = WINDOW_REGISTRY[instance.appId];
  const isFocused = manager.focusedId === instance.id;

  if (instance.minimized || !def) return null;

  return (
    <div
      className="win-frame win-frame-animated"
      style={{
        position: "absolute",
        left: instance.x,
        top: instance.y,
        width: instance.width,
        height: instance.height,
        zIndex: instance.zIndex,
      }}
      onPointerDown={() => {
        if (!isFocused) manager.focus(instance.id);
      }}
    >
      <WindowHeader
        title={instance.title}
        x={instance.x}
        y={instance.y}
        isFocused={isFocused}
        isMaximized={instance.maximized}
        onDrag={(x, y) => manager.move(instance.id, x, y)}
        onDoubleClick={() =>
          instance.maximized ? manager.restore(instance.id) : manager.maximize(instance.id)
        }
        buttons={
          <WindowButtons
            isMaximized={instance.maximized}
            onMinimize={() => manager.minimize(instance.id)}
            onMaximizeToggle={() =>
              instance.maximized ? manager.restore(instance.id) : manager.maximize(instance.id)
            }
            onClose={() => manager.close(instance.id)}
          />
        }
      />

      <MenuBar menus={defaultWindowMenus(() => manager.close(instance.id))} />

      <WindowBody Component={def.component} />

      <Resizable
        width={instance.width}
        height={instance.height}
        disabled={instance.maximized}
        onResize={(width, height) => manager.resize(instance.id, width, height)}
      />
    </div>
  );
}
