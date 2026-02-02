"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Server } from "@/lib/types";
import { getServers } from "@/services/server.service";
import { useServerEvents } from "@/hooks/useServerEvents";

interface ServerStoreContextType {
  servers: Server[];
  updateServer: (update: Partial<Server> & { _id: string }) => void;
  appendServerLog: (serverId: string, line: string) => void;
  refreshServers: () => void;
}

const ServerStoreContext = createContext<ServerStoreContextType | undefined>(
  undefined
);

export function ServerStoreProvider({ children }: { children: React.ReactNode }) {
  const [servers, setServers] = useState<Server[]>([]);

  const refreshServers = async () => {
    const s = await getServers();
    setServers(s);
  };

  const updateServer = (update: Partial<Server> & { _id: string }) => {
    setServers((prev) =>
      prev.map((s) => (s._id === update._id ? { ...s, ...update } : s))
    );
  };

  const appendServerLog = (serverId: string, line: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s._id === serverId
          ? { ...s, logs: [...(s.logs ?? []), line] }
          : s
      )
    );
  };

  // Load initial servers on mount
  useEffect(() => {
    refreshServers();
  }, []);

  // Subscribe to WS events for all servers
  useServerEvents("all", (msg) => {
    switch (msg.type) {
      case "status":
        updateServer({ _id: msg.payload.id, status: msg.payload.status });
        break;

      case "log":
        appendServerLog(msg.payload.id, msg.payload.line);
        break;

      case "stats":
        updateServer({ _id: msg.payload.id, cpuUsage: msg.payload.cpu, memoryUsageMb: msg.payload.memoryMb });
        break;
    }
  });

  return (
    <ServerStoreContext.Provider value={{ servers, updateServer, appendServerLog, refreshServers }}>
      {children}
    </ServerStoreContext.Provider>
  );
}

export function useServerStore() {
  const ctx = useContext(ServerStoreContext);
  if (!ctx) throw new Error("useServerStore must be used inside ServerStoreProvider");
  return ctx;
}
