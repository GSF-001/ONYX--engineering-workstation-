import { MenuBarItem, type MenuBarAction } from "./MenuBarItem";

interface MenuBarProps {
  menus: { label: string; actions: MenuBarAction[] }[];
}

/** The "File View Repository Tools Window Help" row rendered at the top
 * of every window body. Menu contents are supplied per-app. */
export function MenuBar({ menus }: MenuBarProps) {
  return (
    <div className="win-menubar">
      {menus.map((menu) => (
        <MenuBarItem key={menu.label} label={menu.label} actions={menu.actions} />
      ))}
    </div>
  );
}

export function defaultWindowMenus(onClose: () => void): MenuBarProps["menus"] {
  return [
    { label: "File", actions: [{ label: "Close Window", onSelect: onClose }] },
    { label: "View", actions: [{ label: "Refresh", onSelect: () => window.location.reload() }] },
    { label: "Window", actions: [{ label: "Close Window", onSelect: onClose }] },
    { label: "Help", actions: [{ label: "About ONYX", onSelect: () => undefined }] },
  ];
}
