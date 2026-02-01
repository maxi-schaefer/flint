import fs from "fs";
import path from "path";
import { EventEmitter } from "stream";
import { ManagedServer } from "../types";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { LogBuffer } from "../logs/LogBuffer";
import { FileManager } from "../fs/FileManager";

interface RunningServer {
    process: ChildProcessWithoutNullStreams;
    server: ManagedServer;
    logs: LogBuffer;
    files: FileManager;
};

export class ServerProcessManager extends EventEmitter {
    private servers = new Map<string, RunningServer>();

    constructor() {
        super();
    }

    /**
     * Start Server Process function
     * @param server The server which should be started. 
     */
    start (server: ManagedServer) {
        console.log(server);

        if(this.servers.has(server.id)) {
            throw new Error("Server already running");
        }

        const jarPath = path.join(server.path, server.jar);

        if(!fs.existsSync(jarPath)) {
            throw new Error(`Server jar not found: ${jarPath}`);
        }

        console.log(`[agent] Starting server "${server.name}"`);

        const proc = spawn(
            "java",
            [
                `-Xms${server.minMemoryMb}M`,
                `-Xmx${server.maxMemoryMb}M`,
                "-jar",
                server.jar,
                "nogui"
            ],
            {
                cwd: server.path
            }
        );

        const logs = new LogBuffer(500);
        const files = new FileManager(server.path);

        proc.stdout.on("data", (data) => {
            const line = data.toString();
            logs.push(line);
            this.emit("log", server.id, line);
        });
        
        proc.stderr.on("data", (data) => {
            const line = data.toString();
            logs.push(line);
            this.emit("log", server.id, line);
        });

        proc.on("exit", (code) => {
            logs.push(`[agent] Server exited with code ${code}`);
            this.emit("status", server.id, "stopped");
            this.servers.delete(server.id);
        });

        this.servers.set(server.id, { process: proc, server, logs, files });
        this.emit("status", server.id, "running");
    }

    /**
     * Stop Server process function
     * @param serverId The id of the server which should be stopped
     */
    stop (serverId: string) {
        const running = this.servers.get(serverId);
        if(!running) {
            throw new Error("Server not running");
        }

        console.log(`[agent] Stopping server "${running.server.name}`);
        
        running.process.stdin.write("stop\n");
    }

    /**
     * List Running servers function
     * @returns An Array of all running servers with their id, name and pid
     */
    listRunning() {
        return Array.from(this.servers.values()).map((s) => ({
            id: s.server.id,
            name: s.server.name,
            pid: s.process.pid
        }));
    }

    /**
     * Send Command to server function
     * @param serverId The ID of the server which will execute the command
     * @param command The command which will be executed on the minecraft server
     */
    sendCommand (serverId: string, command: string) {
        const running = this.servers.get(serverId);

        if(!running) {
            throw new Error("Server not running");
        }

        running.process.stdin.write(command.trim() + "\n");
    }

    getLogs(serverId: string): string[] {
        const running = this.servers.get(serverId);
        if(!running) throw new Error("Server not running");
        return running.logs.getLines();
    }

    listFiles(serverId: string, relPath: string) {
        const running = this.servers.get(serverId);
        if(!running) throw new Error("Server not running");
        return running.files.list(relPath);
    }
    
    readFile(serverId: string, relPath: string) {
        const running = this.servers.get(serverId)
        if(!running) throw new Error("Server not running");
        return running.files.readFile(relPath);
    }
    
    writeFile(serverId: string, relPath: string, content: string) {
        const running = this.servers.get(serverId)
        if(!running) throw new Error("Server not running");
        running.files.writeFile(relPath, content);
    }
}