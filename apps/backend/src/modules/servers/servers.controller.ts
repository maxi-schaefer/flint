import { Request, Response } from "express";
import * as ServersService from "./servers.service";

export async function createServer(req: Request, res: Response) {
    try {        
        const server = await ServersService.createServer((req as any).user.userId, req.body);
        res.json(server);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function listServers(_req: Request, res: Response) {
    try {
        const servers = await ServersService.listServers();
        res.json(servers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getServer(req: Request, res: Response) {
    try {
        const server = await ServersService.getServer(req.params.id as string);
    
        if(!server) {
            return res.status(404).json({ error: "Server not found" });
        }
    
        res.json(server);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function startServer(req: Request, res: Response) {
    try {
        const server = await ServersService.startServer(req.params.id as string);
    
        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }
    
        res.json({ ok: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function stopServer(req: Request, res: Response) {
    try {
        const server = await ServersService.stopServer(req.params.id as string);
    
        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }
    
        res.json({ ok: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getLogs(req: Request, res: Response) {
    try {
        const logs = await ServersService.requestLogs(req.params.id as string);
        res.json({ logs });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function listFiles(req: Request, res: Response) {
    try {
        const files = await ServersService.listFiles(req.params.id as string, req.query.path as string || ".");
        res.json({ files });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function readFile(req: Request, res: Response) {
    try {
        const content = await ServersService.readFile(req.params.id as string, req.query.path as string);
        res.json({ content });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function writeFile(req: Request, res: Response) {
    try {
        await ServersService.writeFile(req.params.id as string, req.body.path, req.body.content);
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function sendCommand(req: Request, res: Response) {
    try {
        await ServersService.sendCommand(req.params.id as string, req.body.command);
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}