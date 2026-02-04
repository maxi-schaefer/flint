export interface Server {
  _id: string
  name: string
  type: "vanilla" | "paper" | "spigot" | "forge" | "fabric"
  version: string
  port: number
  maxPlayers: number
  whitelist: boolean
  onlineMode: boolean
  minMemoryMb: number
  maxMemoryMb: number
  createdAt: string
  updatedAt: string
  status: "running" | "stopped" | "starting" | "crashed"
  logs?: string[]  // <-- add optional logs array
  cpuUsage?: number
  memoryUsageMb?: number
}

export interface FileItem {
  name: string
  isDirectory: boolean
  size?: string
  modified: string
  path: string
}

export interface Player {
    username: string;
    uuid: string;

    // joinedAt: string;
    // playtime: string;
    // lastSeen: string;

    isOnline: boolean;
    isOp: boolean;
    isWhitelisted: boolean;
    isBanned: boolean;

    banReason?: string;
    bannedAt?: string;
}
