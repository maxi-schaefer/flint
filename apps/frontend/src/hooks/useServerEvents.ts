"use client";

import { useEffect, useRef } from "react";
import { Server } from "@/lib/types";

export type ServerEvent =
  | {
      type: "log";
      payload: { id: string; line: string };
      event: true;
    }
  | {
      type: "status";
      payload: { id: string; status: Server["status"] };
      event: true;
    };

export function useServerEvents(
  serverId: string,
  onEvent: (msg: ServerEvent) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !serverId) return;

    const ws = new WebSocket(`ws://localhost:8081?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", payload: { serverId } }));
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as ServerEvent;
        if (!msg.event) return;
        if (msg.payload?.id !== serverId && serverId !== "all") return;

        onEvent(msg);
      } catch (err) {
        console.warn("[ws] Invalid message", err);
      }
    };

    ws.onerror = () => {
      console.warn("[ws] WebSocket error");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", payload: { serverId } }));
      }
      ws.close();
      wsRef.current = null;
    };
  }, [serverId, onEvent]);
}
