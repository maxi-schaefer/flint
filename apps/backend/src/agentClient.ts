import WebSocket from "ws";
import { broadcastToServer } from "./ws";

type AgentMessage =
  | {
      type: "log";
      payload: {
        id: string;
        line: string;
      };
    }
  | {
      type: "status";
      payload: {
        id: string;
        status: string;
      };
    }
  | {
      type: "players";
      payload: {
        id: string;
        players: any[];
      };
    }
  | {
    type: "stats";
    payload: {
      id: string,
      cpu: number,
      memoryMb: number
    }
  }

export const agent = new WebSocket("ws://localhost:9001");

agent.on("open", () => {
  console.log("[backend] Connected to agent");
});

agent.on("message", (data) => {
  let msg: AgentMessage;
  
  try {
    msg = JSON.parse(data.toString());
    console.log(msg);
  } catch {
    console.warn("[agent] Invalid JSON message");
    return;
  }

  // Only forward known event types
  if (
    msg.type === "log" ||
    msg.type === "status" ||
    msg.type === "players" ||
    msg.type === "stats"
  ) {
    const serverId = msg.payload.id;

    if(msg.type === "stats") {
      console.log(msg.payload)
    }

    if (!serverId) {
      console.warn("[agent] Missing server id in payload");
      return;
    }

    broadcastToServer(serverId, {
      type: msg.type,
      payload: msg.payload,
    });
  }
});

agent.on("close", () => {
  console.warn("[backend] Agent disconnected");
});

agent.on("error", (err) => {
  console.error("[backend] Agent error", err);
});
