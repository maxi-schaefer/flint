export type ServerStatus = "running" | "stopped" | "starting" | "crashed";

export interface ManagedServer {
    id: string;
    name: string;
    path: string;
    jar: string;
    minMemoryMb: number;
    maxMemoryMb: number;
    port: number;
    status: ServerStatus;
}

export interface Player {
    id: string;              
    username: string;
    uuid: string;
    joinedAt: string;       
    playtime: string;       
    lastSeen: string;
    isOnline: boolean;
    isOp: boolean;
    isWhitelisted: boolean;
    isBanned: boolean;
    banReason?: string;
    bannedAt?: string;
}