"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Server as ServerIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Server } from "@/lib/types";
import { useServerStore } from "@/context/ServerStoreContext";


export function Sidebar() {
  const pathname = usePathname();
  const { servers } = useServerStore();

  const NavItem = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
  }) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          active
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        {children}
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r bg-card h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <ServerIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Flint</h2>
          <p className="text-xs text-muted-foreground">
            Server Management
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Main */}
          <div className="space-y-1">
            <NavItem href="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavItem>

            <NavItem href="/create" icon={Plus}>
              Create Server
            </NavItem>
          </div>

          <Separator />

          {/* Servers */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-medium text-muted-foreground">
              Servers
            </p>

            {servers.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No servers yet
              </p>
            )}

            {servers.map((server) => {
              const active = pathname === `/${server._id}`;

              return (
                <Link
                  key={server._id}
                  href={`/${server._id}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ServerIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{server.name}</span>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      server.status === "running"
                        ? "border-success/30 text-success"
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    {server.status}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
