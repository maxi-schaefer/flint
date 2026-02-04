import fs from "fs"
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { EventEmitter } from "ws";

type OnlinePlayer = {
    uuid: string;
    username: string;
    joinedAt: number;
}

export class PlayerManager {
    constructor(private serverPath: string) {}

    private online = new Map<string, OnlinePlayer>();
    private pendingUUIDs = new Map<string, string>();

    private readJson<T>(file: string, fallback: T): T {
        const full = path.join(this.serverPath, file);
        if(!fs.existsSync(full)) return fallback;
        return JSON.parse(fs.readFileSync(full, "utf-8"))
    }

    private writeJson(file: string, data: any) {
        const full = path.join(this.serverPath, file);
        fs.writeFileSync(full, JSON.stringify(data, null, 2));
    }

    getOps() {
        return this.readJson<any[]>("ops.json", []);
    }

    getWhitelist() {
        return this.readJson<any[]>("whitelist.json", []);
    }

    getBans() {
        return this.readJson<any[]>("banned-players.json", []);
    }

    banPlayer(uuid: string, username: string, reason: string) {
        const bans = this.getBans();
        bans.push({
            uuid,
            name: username,
            reason,
            created: new Date().toISOString(),
            source: "panel",
            expires: "forever"
        });
        this.writeJson("banned-players.json", bans);
    }

    unbanPlayer(uuid: string) {
        const bans = this.getBans().filter(p => p.uuid !== uuid);
        this.writeJson("banned-players.json", bans);
    }

    addToWhitelist(uuid: string, username: string) {
        const wl = this.getWhitelist();
        wl.push({ uuid, name: username });
        this.writeJson("whitelist.json", wl);
    }

    removeFromWhitelist(uuid: string) {
        const wl = this.getWhitelist().filter(p => p.uuid !== uuid);
        this.writeJson("whitelist.json", wl);
    }

    setOp(uuid: string, username: string, level = 4) {
        const ops = this.getOps().filter(p => p.uuid !== uuid);
        ops.push({ uuid, name: username, level, bypassesPlayerLimit: false });
        this.writeJson("ops.json", ops);
    }

    removeOp(uuid: string) {
        const ops = this.getOps().filter(p => p.uuid !== uuid);
        this.writeJson("ops.json", ops);
    }

    handleLogLine(line: string) {
        // UUID announcement (plugin-safe)
        const uuidMatch = line.match(
            /UUID of player (\w+) is ([0-9a-fA-F-]{36})/
        );

        if (uuidMatch) {
            const [, username, uuid] = uuidMatch;
            this.pendingUUIDs.set(username, uuid);
            return;
        }

        // Successfull login
        const loginMatch = line.match(
            /:\s*(\w+)\[.*\] logged in with entity id/
        );

        
        if (loginMatch) {
            console.log(loginMatch)
            const username = loginMatch[1];
            const uuid = this.pendingUUIDs.get(username);

            if (!uuid) return;

            const player = {
                uuid,
                username,
                joinedAt: Date.now(),
            };

            this.online.set(uuid, player);
            this.pendingUUIDs.delete(username);
            
            return;
        }

        // Disconnect
        const disconnectMatch = line.match(
            /:\s*(\w+) lost connection/
        );

        if (disconnectMatch) {
            const username = disconnectMatch[1];

            const entry = [...this.online.values()].find(
                p => p.username === username
            );

            if (entry) {
                this.online.delete(entry.uuid);
            }
        }
    }

    getOnlinePlayers() {
        return Array.from(this.online.values());
    }
}