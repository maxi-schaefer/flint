"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { RotateCcw, Square, Play, TerminalIcon, Download, Trash2, Send } from "lucide-react";
import { Server } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import TerminalLine from "./terminal-line";
import { useServerStore } from "@/context/ServerStoreContext";
import { getServerLogs, sendCommand, startServer, stopServer } from "@/services/server.service";
import { Input } from "../ui/input";

export function Terminal({ server }: { server: Server }) {
  const { servers, appendServerLog, updateServer } = useServerStore();
  const [command, setCommand] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  // Get the current server from context
  const currentServer = servers.find((s) => s._id === server._id);

  // Load initial logs on mount if not already in context
  useEffect(() => {
    if (!currentServer?.logs || currentServer.logs.length === 0) {
      getServerLogs(server._id)
        .then((logs) => logs.forEach((line) => appendServerLog(server._id, line)))
        .catch(() => {}); // ignore errors
    }
  }, [server._id, appendServerLog, currentServer?.logs]);

  // Auto scroll on log changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentServer?.logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Add command to logs immediately
    appendServerLog(server._id, `[${timestamp}] [Server thread/INFO]: Executing command: ${command}\n`);

    await sendCommand(server._id, command);
    setCommand("");
  };

  const clearTerminal = () => updateServer({ _id: server._id, logs: [] });

  const downloadLogs = () => {
    const blob = new Blob([currentServer?.logs?.join("\n") ?? ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${server.name}-logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStart = async () => await startServer(server._id);
  const handleStop = async () => await stopServer(server._id);

  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Terminal</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-accent bg-transparent"
            onClick={handleStart}
            disabled={server.status === "running"}
          >
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-accent bg-transparent"
            onClick={handleStop}
            disabled={server.status === "stopped"}
          >
            <Square className="mr-2 h-4 w-4" /> Stop
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-accent bg-transparent"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Restart
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col bg-card border-border overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium text-foreground">Console</CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  server.status === "running"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {server.status}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={downloadLogs}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={clearTerminal}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-background/50 max-h-125">
            {currentServer?.logs?.map((line, i) => (
              <TerminalLine key={i} line={line} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border bg-muted/30">
            <span className="text-primary font-mono text-sm">{"> "}</span>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 font-mono text-sm text-foreground placeholder:text-muted-foreground"
              disabled={server.status !== "running"}
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={server.status !== "running"}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
