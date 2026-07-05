import { useState } from "react";
import type { IconPosition } from "./DesktopState";
import { APP_ICONS } from "../icons";
import { Draggable } from "../window-manager";
import { playDragStart, playDrop } from "../audio";

interface DesktopIconProps {
  position: IconPosition;
  isSelected: boolean;
  isRenaming: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onMove: (x: number, y: number) => void;
  onRename: (label: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function DesktopIcon({
  position,
  isSelected,
  isRenaming,
  onSelect,
  onOpen,
  onMove,
  onRename,
  onContextMenu,
}: DesktopIconProps) {
  const Icon = APP_ICONS[position.appId];
  const [draftLabel, setDraftLabel] = useState(position.label);

  return (
    <div
      style={{ position: "absolute", left: position.x, top: position.y, zIndex: 1 }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
        onContextMenu(e);
      }}
    >
      <Draggable
        x={position.x}
        y={position.y}
        onDrag={onMove}
        onDragEnd={playDrop}
        disabled={isRenaming}
      >
        {({ onPointerDown }) => (
          <div
            className={`win-icon${isSelected ? " selected" : ""}`}
            onPointerDown={(e) => {
              onPointerDown(e);
              playDragStart();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
          >
            {Icon ? <Icon /> : <div style={{ width: 32, height: 32 }} />}
            {isRenaming ? (
              <input
                autoFocus
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onRename(draftLabel.trim() || position.label);
                  if (e.key === "Escape") onRename(position.label);
                }}
                onBlur={() => onRename(draftLabel.trim() || position.label)}
                style={{
                  width: 70,
                  fontSize: 11,
                  textAlign: "center",
                  background: "#fff",
                  color: "#000",
                }}
              />
            ) : (
              <span className="win-icon-label">{position.label}</span>
            )}
          </div>
        )}
      </Draggable>
    </div>
  );
}
