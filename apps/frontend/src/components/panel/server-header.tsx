"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Server } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Play, Square, RotateCcw, Settings } from "lucide-react"

export function ServerHeader({ server }: { server: Server }) {
    const isRunning = server.status === "running"

    return (
        <div className="border-b border-border bg-background sticky top-0 z-20">
        <div className="px-6 py-4 flex items-center justify-between">
            {/* Left */}
            <div className="space-y-1">
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">
                {server.name}
                </h1>

                <Badge
                variant="outline"
                className={cn(
                    isRunning
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-muted text-muted-foreground"
                )}
                >
                {server.status}
                </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
                {server.type} {server.version}
                {" • "}Port {server.port}
                {" • "}{server.maxPlayers} slots
            </div>
            </div>


            <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
            </Button>
            </div>
        </div>
    )
}
