"use client"

import FileBrowser from "@/components/panel/file-browser"
import Players from "@/components/panel/players"
import { ServerHeader } from "@/components/panel/server-header"
import { Terminal } from "@/components/panel/terminal"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useServerStore } from "@/context/ServerStoreContext"
import {
    AppWindow,
  Archive,
  FolderOpen,
  TerminalIcon,
  Users,
} from "lucide-react"
import { useParams } from "next/navigation"

function ServerPage() {
  const { servers } = useServerStore();
  const params = useParams<{ serverId: string }>();
  const serverId = params.serverId;

  const server = servers.find((s) => s._id === serverId);

  if (!server) return <div className="p-6 text-muted-foreground">Loading server…</div>;

  return (
    <div className="h-full flex flex-col">
        <ServerHeader server={server} />

        <Tabs defaultValue="terminal" className="flex-1 flex flex-col">
            <TabsList className="mt-2 mx-auto">
                <TabsTrigger value="terminal" className="gap-2">
                    <AppWindow className="h-4 w-4" />
                    Terminal
                </TabsTrigger>
                <TabsTrigger value="files" className="gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Files
                </TabsTrigger>
                <TabsTrigger value="players" className="gap-2">
                    <Users className="h-4 w-4" />
                    Players
                </TabsTrigger>
                <TabsTrigger value="backups" className="gap-2">
                    <Archive className="h-4 w-4" />
                    Backups
                </TabsTrigger>
            </TabsList>

            <TabsContent value="terminal" className="flex-1">
                <Terminal server={server} />
            </TabsContent>

            <TabsContent value="files" className="flex-1">
                <FileBrowser server={server} />
            </TabsContent>

            <TabsContent value="players" className="flex-1">
                <Players server={server} />
            </TabsContent>

            <TabsContent value="backups" className="p-4 text-muted-foreground">
                Backup manager coming next
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default ServerPage
