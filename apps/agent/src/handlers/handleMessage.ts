import fs from "fs";
import path from "path";
import { manager } from "../manager";
import { ManagedServer } from "../types";
import { downloadJar } from "./handleDownloads";

export async function handleAgentMessage(msg: any) {
    switch (msg.type) {
        case "start":
            manager.start(msg.payload as ManagedServer);
            return { ok: true }

        case "stop":
            manager.stop(msg.payload.id);
            return { ok: true }

        case "command": 
            manager.sendCommand(msg.payload.id, msg.payload.command);
            return { ok: true }

        case "getLogs":
            return manager.getLogs(msg.payload.id);

        case "listFiles":
            return manager.listFiles(
                msg.payload.id,
                msg.payload.path
            )

        case "readFile":
            return manager.readFile(
                msg.payload.id,
                msg.payload.path
            )

        case "writeFile":
            manager.writeFile(
                msg.payload.id,
                msg.payload.path,
                msg.payload.content
            );
            return { ok: true }

        case "createServer":
            const { id, type, version, path: serverPath, jar, port, maxPlayers, whitelist, onlineMode } = msg.payload;

            if(!fs.existsSync(serverPath)) fs.mkdirSync(serverPath, { recursive: true });

            const jarPath = path.join(serverPath, jar);
            await downloadJar(type, version, jarPath);
            
            fs.writeFileSync(path.join(serverPath, "eula.txt"), "eula=true");

            const props = `
server-port=${port}
max-players=${maxPlayers}
online-mode=${onlineMode}
white-list=${whitelist}
            `.trim();

            fs.writeFileSync(path.join(serverPath, "server.properties"), props);

            manager.registerServerPath(id, serverPath);
            return { ok: true }

        case "registerServerPath":
            manager.registerServerPath(msg.payload.id, msg.payload.path);
            return { ok: true }

        case "getPlayers": {
            const pm = manager.getPlayerManager(msg.payload.id);

            return {
                whitelist: pm.getWhitelist(),
                ops: pm.getOps(),
                bans: pm.getBans()
            };
            }

            case "banPlayer": {
                const { id, uuid, username, reason } = msg.payload;
                const pm = manager.getPlayerManager(id);

                pm.banPlayer(uuid, username, reason);
                manager.sendCommand(id, `ban ${username} ${reason}`);
                return { ok: true };
            }

            case "unbanPlayer": {
                const { id, uuid } = msg.payload;
                const pm = manager.getPlayerManager(id);

                pm.unbanPlayer(uuid);
                return { ok: true };
            }

            case "kickPlayer":
                manager.sendCommand(msg.payload.id, `kick ${msg.payload.username}`);
                return { ok: true };

            case "addWhitelist": {
                const pm = manager.getPlayerManager(msg.payload.id);
                pm.addToWhitelist(msg.payload.uuid, msg.payload.username);
                return { ok: true };
            }   

            case "removeWhitelist": {
            const pm = manager.getPlayerManager(msg.payload.id);
                pm.removeFromWhitelist(msg.payload.uuid);
                return { ok: true };
            }

            case "setOp": {
                const pm = manager.getPlayerManager(msg.payload.id);
                pm.setOp(msg.payload.uuid, msg.payload.username);
                return { ok: true };
            }

            case "removeOp": {
                const pm = manager.getPlayerManager(msg.payload.id);
                pm.removeOp(msg.payload.uuid);
                return { ok: true };
            }

        default:
            throw new Error(`Unkown command: ${msg.type}`)
    }
}