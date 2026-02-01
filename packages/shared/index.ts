export type ServerStatus = "running" | "stopped" | "starting" | "crashed";

export interface Server {
    id: string;
    name: string;
    path: string;
    port: number;
    status: ServerStatus;
}