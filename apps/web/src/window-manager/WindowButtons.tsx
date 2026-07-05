interface WindowButtonsProps {
  onMinimize: () => void;
  onMaximizeToggle: () => void;
  onClose: () => void;
  isMaximized: boolean;
}

export function WindowButtons({ onMinimize, onMaximizeToggle, onClose, isMaximized }: WindowButtonsProps) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      <button className="win-button" aria-label="Minimize" onClick={onMinimize}>
        _
      </button>
      <button className="win-button" aria-label={isMaximized ? "Restore" : "Maximize"} onClick={onMaximizeToggle}>
        {isMaximized ? "❐" : "□"}
      </button>
      <button className="win-button" aria-label="Close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
