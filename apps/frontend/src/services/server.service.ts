import api from "@/lib/api";
import { FileItem, Server } from "@/lib/types";

interface ServerResponse {
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
}

interface CreateServerReq {
    name: string,
    type: string,
    version: string,
    port: number,
    maxPlayers?: number,
    whitelist?: boolean,
    onlineMode?: boolean,
}

const mapServer = (s: ServerResponse): Server => ({
    _id: s._id,
    name: s.name,
    type: s.type,
    version: s.version,
    port: s.port,
    maxPlayers: s.maxPlayers,
    whitelist: s.whitelist,
    onlineMode: s.onlineMode,
    minMemoryMb: s.minMemoryMb,
    maxMemoryMb: s.maxMemoryMb,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    status: s.status
});

export async function getServers() {
    const { data } = await api.get<ServerResponse[]>("/servers");
    return data.map(mapServer);
}

export async function getServer(id: string) {
    const { data } = await api.get<ServerResponse>(`/servers/${id}`);
    return mapServer(data);
}

export async function startServer(id: string) {
    await api.post(`/servers/${id}/start`);
}

export async function stopServer(id: string) {
    await api.post(`/servers/${id}/stop`);
}

export async function getServerLogs(id: string): Promise<string[]> {
    const { data } = await api.get(`/servers/${id}/logs`);
    return data.logs as string[]
}

export async function sendCommand(id: string, command: string) {
    await api.post(`/servers/${id}/command`, { command });
}

export async function createServer(body: CreateServerReq) {
    const { data } = await api.post(`/servers`, body);
    return mapServer(data);
}

export async function getFiles(id: string, path?: string): Promise<FileItem[]> {
    const { data } = await api.get(`/servers/${id}/files${path ? "?path=" + path : ""}`);
    return data.files;
}

export async function readFile(id: string, file: string) {
    const { data } = await api.get(`/servers/${id}/file?path=${file}`);
    return data.content;
}

export async function writeFile(id: string, path: string, content: string) {
    await api.post(`/servers/${id}/file`, { content, path });
}