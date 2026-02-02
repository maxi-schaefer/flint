"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Plus,
  Server as ServerIcon,
  LogOut
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useServerStore } from "@/context/ServerStoreContext";
import { useAuth } from "@/providers/AuthProvider";

export function Sidebar() {
  const pathname = usePathname();
  const { servers } = useServerStore();
  const { logout } = useAuth();

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
          "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
          active
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {children}
      </Link>
    );
  };

  return (
    <aside className="w-56 border-r bg-card h-screen flex flex-col">
      {/* Header */}
      <div className="px-3 py-3 border-b flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <ServerIcon className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-tight">
          <h2 className="text-sm font-semibold">Flint</h2>
          <p className="text-[10px] text-muted-foreground">
            Server Management
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Main */}
          <div className="space-y-1">
            <NavItem href="/dashboard" icon={LayoutGrid}>
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
                    "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-sm transition-all",
                    active
                      ? "bg-accent text-foreground border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground border-l-2 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ServerIcon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                    <span className="truncate">{server.name}</span>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0",
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

      <div className="border-t p-2">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
