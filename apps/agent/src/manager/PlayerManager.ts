import fs from "fs"
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class PlayerManager {
    constructor(private serverPath: string) {}

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
}