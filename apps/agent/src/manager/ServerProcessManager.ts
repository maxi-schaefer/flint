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
}

export class ServerProcessManager extends EventEmitter {
    private servers = new Map<string, RunningServer>();
    private fileManagers = new Map<string, FileManager>();
    private serverPaths = new Map<string, string>(); // store path for offline servers

    constructor() {
        super();
    }

    /**
     * Register server path for offline access
     */
    registerServerPath(id: string, serverPath: string) {
        this.serverPaths.set(id, serverPath);
        if (!this.fileManagers.has(id)) {
        this.fileManagers.set(id, new FileManager(serverPath));
        }
    }

    /**
     * Start Server Process
     */
    start(server: ManagedServer) {
        if (this.servers.has(server.id)) {
        throw new Error("Server already running");
        }

        const jarPath = path.join(server.path, server.jar);
        if (!fs.existsSync(jarPath)) throw new Error(`Server jar not found: ${jarPath}`);

        console.log(`[agent] Starting server "${server.name}"`);

        const proc = spawn(
        "java",
        [`-Xms${server.minMemoryMb}M`, `-Xmx${server.maxMemoryMb}M`, "-jar", server.jar, "nogui"],
        { cwd: server.path }
        );

        const logs = new LogBuffer(500);
        const files = this.getFileManager(server.id, server.path);

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
        this.registerServerPath(server.id, server.path); // ensure offline file access
        this.emit("status", server.id, "running");
    }

    stop(serverId: string) {
        const running = this.servers.get(serverId);
        if (!running) throw new Error("Server not running");
        running.process.stdin.write("stop\n");
    }

    sendCommand(serverId: string, command: string) {
        const running = this.servers.get(serverId);
        if (!running) throw new Error("Server not running");
        running.process.stdin.write(command.trim() + "\n");
    }

    getLogs(serverId: string): string[] {
        const running = this.servers.get(serverId);
        if (!running) throw new Error("Server not running");
        return running.logs.getLines();
    }

    /**
     * Get FileManager by server ID (creates for offline server if needed)
     */
    private getFileManager(serverId: string, serverPath?: string) {
        if (!this.fileManagers.has(serverId)) {
        if (!serverPath && !this.serverPaths.has(serverId)) {
            throw new Error(`No path registered for server ${serverId}`);
        }
        const pathToUse = serverPath ?? this.serverPaths.get(serverId)!;
        this.fileManagers.set(serverId, new FileManager(pathToUse));
        }
        return this.fileManagers.get(serverId)!;
    }

    listFiles(serverId: string, relPath = ".") {
        const fm = this.getFileManager(serverId);
        return fm.list(relPath);
    }

    readFile(serverId: string, relPath: string) {
        const fm = this.getFileManager(serverId);
        return fm.readFile(relPath);
    }

    writeFile(serverId: string, relPath: string, content: string) {
        const fm = this.getFileManager(serverId);
        return fm.writeFile(relPath, content);
    }

    listRunning() {
        return Array.from(this.servers.values()).map((s) => ({
        id: s.server.id,
        name: s.server.name,
        pid: s.process.pid,
        }));
    }
}
