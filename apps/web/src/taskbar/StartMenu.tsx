import { WINDOW_REGISTRY } from "../window-manager";
import { useNavigate } from "react-router-dom";

interface StartMenuProps {
  onOpenApp: (appId: string) => void;
  onClose: () => void;
}

export function StartMenu({ onOpenApp, onClose }: StartMenuProps) {
  const navigate = useNavigate();

  return (
    <div
      className="context-menu"
      style={{
        position: "absolute",
        bottom: "100%",
        left: 0,
        width: 220,
        marginBottom: 2,
      }}
    >
      {Object.values(WINDOW_REGISTRY).map((app) => (
        <div
          key={app.id}
          className="context-menu-item"
          onClick={() => {
            onOpenApp(app.id);
            onClose();
          }}
        >
          {app.title}
        </div>
      ))}
      <div className="context-menu-divider" />
      <div
        className="context-menu-item"
        onClick={() => {
          navigate("/restart");
          onClose();
        }}
      >
        Restart
      </div>
      <div
        className="context-menu-item"
        onClick={() => {
          navigate("/shutdown");
          onClose();
        }}
      >
        Shut Down
      </div>
    </div>
  );
}
