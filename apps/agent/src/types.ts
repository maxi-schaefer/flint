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