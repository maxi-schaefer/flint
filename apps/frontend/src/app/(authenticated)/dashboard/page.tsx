"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useServerStore } from "@/context/ServerStoreContext";
import { Server } from "@/lib/types"
import { cn } from "@/lib/utils";
import { startServer, stopServer } from "@/services/server.service";
import { Cpu, MoreVertical, Play, RotateCcw, ServerIcon, Shield, ShieldOff, Square, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getStatusColor(status: Server["status"]) {
  switch (status) {
    case "running":
      return "bg-success text-success"
    case "stopped":
      return "bg-muted-foreground/30 text-muted-foreground"
    case "starting":
      return "bg-warning text-warning"
    case "crashed":
      return "bg-warning text-warning"
  }
}

function getStatusBadge(status: Server["status"]) {
  switch (status) {
    case "running":
      return "bg-success/10 text-success border-success/20"
    case "stopped":
      return "bg-muted text-muted-foreground border-muted"
    case "starting":
      return "bg-warning/10 text-warning border-warning/20"
    case "crashed":
      return "bg-warning/10 text-warning border-warning/20"
  }
}


function DashboardPage() {
    const { servers } = useServerStore();
    const router = useRouter();

    const handleStart = async (serverId: string) => {
        try {
            await startServer(serverId);
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleStop = async (serverId: string) => {
        try {
            await stopServer(serverId);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Manage your Minecraft servers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Servers</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {servers.length}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                                <ServerIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Online Servers</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {servers.filter((s) => s.status === "running").length}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                                <ServerIcon className="h-5 w-5 text-success" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg CPU Usage</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {Math.round(
                                            servers.reduce((acc, s) => acc + (s.cpuUsage || 0), 0) / servers.filter((s) => s.status === "running").length || 0
                                    )} %
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                                <Cpu className="h-5 w-5 text-chart-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-lg font-medium text-foreground mb-4">Your Servers</h2>
                {servers.length === 0 && (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                        <ServerIcon className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium">No servers yet</p>
                        <p className="text-xs text-muted-foreground mb-4">
                            Create your first Minecraft world in seconds
                        </p>
                        <Button size="sm" onClick={() => router.push("/create")}>Create Server</Button>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {servers.map((server) => (
                        <Card key={server._id}   className={cn("bg-card border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/50")}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <Link className="cursor-pointer" href={`/${server._id}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-3 w-3 rounded-full", getStatusColor(server.status), server.status === "running" && "animate-pulse")} />

                                            <div>
                                                <h3 className="font-medium text-foreground">{server.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant={"outline"} className="text-xs border-border text-muted-foreground">
                                                        {server.type}
                                                    </Badge>

                                                    <span className="text-xs text-muted-foreground">
                                                        v{server.version}
                                                    </span>

                                                    {server.whitelist ? (
                                                        <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                                                            <Shield className="mr-1 h-3 w-3" />
                                                            Whitelist
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="text-xs bg-muted text-muted-foreground border-border">
                                                            <ShieldOff className="mr-1 h-3 w-3" />
                                                            Public
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                        <div className="flex items-center gap-2">
                                            <Badge variant={"outline"} className={cn("text-xs", getStatusBadge(server.status))}>
                                                {server.status}
                                            </Badge>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant={"ghost"} size={"icon"} className="h-8 w-8 text-muted-foreground">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-popover border-border">
                                                    {server.status !== "running" && (
                                                        <DropdownMenuItem onClick={() => handleStart(server._id)}>
                                                            <Play className="mr-2 h-4 w-4" /> Start
                                                        </DropdownMenuItem>
                                                    )}

                                                    {server.status === "running" && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => handleStop(server._id)}>
                                                        <Square className="mr-2 h-4 w-4" /> Stop
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                        <RotateCcw className="mr-2 h-4 w-4" /> Restart
                                                        </DropdownMenuItem>
                                                    </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm border-t pt-4">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <Users className="h-3.5 w-3.5" />
                                                <span className="text-xs">Players</span>
                                            </div>
                                            <p className="font-medium text-foreground">
                                                0/{server.maxPlayers}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <Users className="h-3.5 w-3.5" />
                                                <span className="text-xs">Memory</span>
                                            </div>
                                            <p className="font-medium text-foreground">
                                                {server.memoryUsageMb || "0"}/{server.maxMemoryMb} MB
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                <Users className="h-3.5 w-3.5" />
                                                <span className="text-xs">CPU</span>
                                            </div>
                                            <p className="font-medium text-foreground">
                                                {server.cpuUsage || "0"} %
                                            </p>
                                        </div>
                                    </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default DashboardPage