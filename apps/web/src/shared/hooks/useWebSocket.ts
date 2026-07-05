import { useEffect, useState } from "react";
import { useSocketEvent } from "../../websocket/useSocketEvent";
import { useSocketContext } from "../../websocket/SocketContext";

/**
 * Convenience hook for a component that needs to (a) know if the socket is
 * connected and (b) subscribe to one room for as long as it's mounted.
 * Wraps the lower-level SocketContext/useSocketEvent primitives so feature
 * components don't touch the raw socket.
 */
export function useWebSocket(room?: string) {
  const { status, subscribe, unsubscribe } = useSocketContext();
  const [isConnected, setIsConnected] = useState(status === "connected");

  useEffect(() => {
    setIsConnected(status === "connected");
  }, [status]);

  useEffect(() => {
    if (!room) return;
    subscribe(room);
    return () => unsubscribe(room);
  }, [room, subscribe, unsubscribe]);

  return { isConnected, status };
}

export { useSocketEvent };
