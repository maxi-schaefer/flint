"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useServerStore } from '@/context/ServerStoreContext';
import { createServer } from '@/services/server.service';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const serverTypes = [
  { value: "vanilla", label: "Vanilla", description: "Official Minecraft server" },
  { value: "paper", label: "Paper", description: "High performance fork of Spigot" },
  { value: "spigot", label: "Spigot", description: "Modified server with plugin support" },
  { value: "forge", label: "Forge", description: "Mod loader for Minecraft" },
  { value: "fabric", label: "Fabric", description: "Lightweight mod loader" },
]

const versions = [
  "1.21.4",
  "1.21.3",
  "1.21.2",
  "1.21.1",
  "1.21",
  "1.20.6",
  "1.20.4",
  "1.20.2",
  "1.20.1",
  "1.19.4",
]

function CreateServer() {
    const router = useRouter();
    const { refreshServers } = useServerStore();
    const [name, setName] = useState("")
    const [type, setType] = useState("paper")
    const [version, setVersion] = useState("1.21.4")
    const [port, setPort] = useState("25565")
    const [memory, setMemory] = useState([4096])
    const [maxPlayers, setMaxPlayers] = useState("20")
    const [enableWhitelist, setEnableWhitelist] = useState(false)
    const [enableCracked, setEnableCracked] = useState(false)
    const [acceptEula, setAcceptEula] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const server = await createServer({
                name: name,
                port: Number.parseInt(port),
                type: type,
                version: version,
                maxPlayers: Number.parseInt(maxPlayers),
                whitelist: enableWhitelist,
                onlineMode: !enableCracked,
            });

            refreshServers();

            router.push(`/${server._id}`);
        
            setName("")
            setType("paper")
            setVersion("1.21.4")
            setPort("25565")
            setMemory([4096])
            setMaxPlayers("20")
            setEnableWhitelist(false)
            setEnableCracked(false)

        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground">Create Server</h1>
                <p className="text-muted-foreground">Set up a new Minecraft server instance</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Plus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-foreground">New Server</CardTitle>
                                <CardDescription>Configure your server settings</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor='name' className='text-foreground'>Server Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="My Minecraft Server"
                                    required
                                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-foreground">Server Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="bg-input border-border text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        {serverTypes.map((t) => (
                                        <SelectItem key={t.value} value={t.value} className="text-foreground">
                                            <div>
                                            <span>{t.label}</span>
                                            <span className="text-xs text-muted-foreground ml-2">
                                                {t.description}
                                            </span>
                                            </div>
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-foreground">Version</Label>
                                    <Select value={version} onValueChange={setVersion}>
                                    <SelectTrigger className="bg-input border-border text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        {versions.map((v) => (
                                        <SelectItem key={v} value={v} className="text-foreground">
                                            {v}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="port" className="text-foreground">Port</Label>
                                    <Input
                                    id="port"
                                    type="number"
                                    value={port}
                                    onChange={(e) => setPort(e.target.value)}
                                    min={1024}
                                    max={65535}
                                    required
                                    className="bg-input border-border text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxPlayers" className="text-foreground">Max Players</Label>
                                    <Input
                                    id="maxPlayers"
                                    type="number"
                                    value={maxPlayers}
                                    onChange={(e) => setMaxPlayers(e.target.value)}
                                    min={1}
                                    max={1000}
                                    required
                                    className="bg-input border-border text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-foreground">Memory Allocation</Label>
                                    <span className="text-sm text-muted-foreground">{memory[0]} MB</span>
                                </div>
                                <Slider
                                    value={memory}
                                    onValueChange={setMemory}
                                    min={512}
                                    max={16384}
                                    step={512}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>512 MB</span>
                                    <span>16 GB</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-foreground">Whitelist</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Only allow whitelisted players to join
                                        </p>
                                    </div>
                                    <Switch checked={enableWhitelist} onCheckedChange={setEnableWhitelist} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-foreground">Offline Mode</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Allow players without Minecraft accounts
                                        </p>
                                    </div>
                                    <Switch checked={enableCracked} onCheckedChange={setEnableCracked} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className='flex gap-2'>
                                    <Checkbox id='accept-eula' checked={acceptEula} onCheckedChange={(value) => setAcceptEula(value as boolean)} />
                                    <Label htmlFor='accept-eula' className='text-foreground'>Accept Eula?</Label>
                                </div>
                            </div>

                            <Button type='submit' className='w-full' disabled={isLoading || !acceptEula}>
                                {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : "Create Server"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CreateServer