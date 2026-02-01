import { ServerModel } from "../../models/server.model";
import { agentRequest } from "../../agent/agentRpc";
import path from 'path';

interface CreateServerInput {
  name: string;
  type: string; // vanilla, paper, forge, etc
  version: string;
  port: number;
  maxPlayers?: number;
  whitelist?: boolean;
  onlineMode?: boolean;
}

export async function createServer(ownerId: string, data: CreateServerInput) {
    // Validate required fields
    if (!data.name || !data.type || !data.version || !data.port) {
        throw new Error("Missing required fields");
    }

    // Generate a folder path for the server (Only temporary)
    const jarName = `${data.type}_${data.version}.jar`;

    const server = await ServerModel.create({
        ...data,
        path: "temp",
        ownerId: ownerId,
        jar: jarName,
        status: "creating"
    });

    const serverPath = path.join("servers", server._id.toString());
    
    await agentRequest("createServer", {
        id: server.id,
        type: data.type,
        version: data.version,
        path: serverPath,
        jar: jarName,
        port: data.port,
        maxPlayers: data.maxPlayers ?? 20,
        whitelist: data.whitelist ?? false,
        onlineMode: data.onlineMode ?? true,
    });
    
    server.path = serverPath;
    server.status = "stopped";
    await server.save();

    return server;
}

export async function listServers() {
    return ServerModel.find();
}

export async function getServer(id: string) {
    return await ServerModel.findById(id);
}

export async function startServer(id: string) {
    const server = await ServerModel.findById(id);
    if (!server) return null;

    await agentRequest("start", {
        id: server._id,
        name: server.name,
        path: server.path,
        jar: server.jar,
        minMemoryMb: server.minMemoryMb,
        maxMemoryMb: server.maxMemoryMb,
        port: server.port
    });

    server.status = "running";
    await server.save();

    return server;
}

export async function stopServer(id: string) {
    const server = await ServerModel.findById(id);
    if (!server) return null;

    await agentRequest("stop", { id: server.id });

    server.status = "stopped";
    await server.save();

    return server;
}

export function requestLogs(id: string) {
    return agentRequest("getLogs", { id });
}

export function listFiles(id: string, path: string) {
    return agentRequest("listFiles", { id, path });
}

export async function readFile(id: string, path: string) {
    return agentRequest("readFile", { id, path });
}

export async function writeFile(id: string, path: string, content: string) {
    return agentRequest("writeFile", { id, path, content });
}

export async function sendCommand(id: string, command: string) {
    return agentRequest("command", { id, command });
}
