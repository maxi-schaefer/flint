"use client";

import { Player, Server } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Copy, MoreVertical, RefreshCw, Search, UserPlus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { getPlayers } from '@/services/players.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';

function Players({ server }: { server: Server }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        getPlayers(server._id).then(setPlayers);

        console.log(players)
    }, [server._id]);

    const copyUuid = (uuid: string) => {
        navigator.clipboard.writeText(uuid);
    }

    const whitelistedPlayers = players.filter((p) => p.isWhitelisted);
    const bannedPlayers = players.filter((p) => p.isBanned);
    
    const filteredPlayers = players.filter((p) => !searchQuery || p.username.toLowerCase().includes(searchQuery.toLowerCase()) || p.uuid.toLowerCase().includes(searchQuery.toLowerCase()))
    const filteredWhitelisted = whitelistedPlayers.filter((p) => !searchQuery || p.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredBanned = bannedPlayers.filter((p) => !searchQuery || p.username.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleRefresh = () => {
        getPlayers(server._id).then(setPlayers);
    }

    const PlayerTable = ({ playerList, type }: { playerList: Player[], type: "all" | "whitelist" | "banned"}) => (
        <Table>
            <TableHeader>
                <TableRow className='border-border hover:bg-transparent'>
                    <TableHead className='text-muted-foreground'>Player</TableHead>
                    <TableHead className='text-muted-foreground'>Status</TableHead>
                    {type === "banned" && (
                        <>
                            <TableHead className='text-muted-foreground'>Ban Reason</TableHead>
                            <TableHead className='text-muted-foreground'>Banned on</TableHead>
                        </>
                    )}
                    <TableHead className="w-12.5" />
                </TableRow>
            </TableHeader>

            <TableBody>
                {playerList.map((player) => (
                    <TableRow key={player.uuid} className='border-border hover:bg-accent/50'>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage src={`https://mc-heads.net/avatar/${player.username}/32`} alt={player.username} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                        {player.username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-foreground">{player.username}</p>
                                        {player.isOp && (
                                            <Badge className='bg-warning/10 text-warning border-warning/20 text-xs'>
                                                OP
                                            </Badge>
                                        )}
                                    </div>
                                    <button className='text-xs text-muted-foreground hover:text-foreground flex items-center gap-1' onClick={() => copyUuid(player.uuid)}>
                                        <span className="truncate max-w-[120px]">{player.uuid}</span>
                                        <Copy className='h-3 w-3' />
                                    </button>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            {type === "banned" ? (
                                <Badge
                                    variant="outline"
                                    className="text-xs bg-destructive/10 text-destructive border-destructive/20"
                                >
                                    Banned
                                </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-xs",
                                    player.isOnline
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-muted text-muted-foreground border-border"
                                )}
                            >
                                {player.isOnline ? "Online" : "Offline"}
                            </Badge>
                        )}
                        </TableCell>
                        {
                            type === "banned" && (
                                <>
                                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                                        {player.banReason}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {player.bannedAt}
                                    </TableCell>
                                </>
                            )
                        }
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"ghost"} size={"icon"} className='h-8 w-8 text-muted-foreground' >
                                        <MoreVertical className='h-4 w-4' />
                                    </Button>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    return (
        <div className="p-6 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Players</h1>
                </div>

                <Button size={"sm"}>
                    <UserPlus className='mr-2 h-4 w-4' /> Add to Whitelist
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* TODO: Add Stats */}
            </div>

            <Tabs defaultValue='all' className='flex-1 flex flex-col'>
                <div className="flex items-center justify-between">
                    <TabsList className="bg-secondary border border-border">
                        <TabsTrigger value="all" className="data-[state=active]:bg-background">
                            All Players
                        </TabsTrigger>
                        <TabsTrigger value="whitelist" className="data-[state=active]:bg-background">
                            Whitelist
                        </TabsTrigger>
                        <TabsTrigger value="banned" className="data-[state=active]:bg-background">
                            Banned
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search players..."
                                className="pl-9 h-8 w-48 bg-input border-border text-foreground text-sm"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <TabsContent value='all' className='flex-1 mt-4'>
                    <Card className='bg-card border-border h-full overflow-hidden'>
                        <CardContent className='p-0 overflow-auto h-full'>
                            <PlayerTable playerList={filteredPlayers} type="all" />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value='whitelist' className='flex-1 mt-4'>
                    <Card className='bg-card border-border h-full overflow-hidden'>
                        <CardContent className='p-0 overflow-auto h-full'>
                            <PlayerTable playerList={filteredWhitelisted} type="whitelist" />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value='banned' className='flex-1 mt-4'>
                    <Card className='bg-card border-border h-full overflow-hidden'>
                        <CardContent className='p-0 overflow-auto h-full'>
                            <PlayerTable playerList={filteredBanned} type="banned" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Players  