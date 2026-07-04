import type { WebSocket } from "ws";
import { roomRegistry } from "./rooms.js";

interface HeartbeatSocket extends WebSocket {
  isAlive?: boolean;
}

const HEARTBEAT_INTERVAL_MS = 30_000;

export function attachHeartbeat(socket: HeartbeatSocket): void {
  socket.isAlive = true;
  socket.on("pong", () => {
    socket.isAlive = true;
  });
}

export function startHeartbeatSweep(getAllSockets: () => Iterable<HeartbeatSocket>): NodeJS.Timeout {
  return setInterval(() => {
    for (const socket of getAllSockets()) {
      if (socket.isAlive === false) {
        roomRegistry.leaveAll(socket);
        socket.terminate();
        continue;
      }
      socket.isAlive = false;
      socket.ping();
    }
  }, HEARTBEAT_INTERVAL_MS);
}
