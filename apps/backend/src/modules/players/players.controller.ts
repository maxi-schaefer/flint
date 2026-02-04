// players.controller.ts
import { Request, Response } from "express";
import * as PlayerService from "./players.service";

/**
 * GET /servers/:id/players
 */
export async function getPlayers(req: Request, res: Response) {
    try {
        const players = await PlayerService.getPlayers(req.params.id as string);
        res.json(players);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * POST /servers/:id/players/ban
 */
export async function banPlayer(req: Request, res: Response) {
    try {
        const { uuid, username, reason } = req.body;

        if (!uuid || !username) {
            return res.status(400).json({ error: "uuid and username required" });
        }

        await PlayerService.banPlayer(req.params.id as string, {
            uuid,
            username,
            reason: reason ?? "No reason provided"
        });

        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * POST /servers/:id/players/unban
 */
export async function unbanPlayer(req: Request, res: Response) {
    try {
        const { uuid } = req.body;

        if (!uuid) {
            return res.status(400).json({ error: "uuid required" });
        }

        await PlayerService.unbanPlayer(req.params.id as string, uuid);
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * POST /servers/:id/players/kick
 */
export async function kickPlayer(req: Request, res: Response) {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: "username required" });
        }

        await PlayerService.kickPlayer(req.params.id as string, username);
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * POST /servers/:id/players/op
 */
export async function setOp(req: Request, res: Response) {
    try {
        const { uuid, username } = req.body;

        if (!uuid || !username) {
            return res.status(400).json({ error: "uuid and username required" });
        }

        await PlayerService.setOp(req.params.id as string, uuid, username);
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * POST /servers/:id/players/deop
 */
export async function removeOp(req: Request, res: Response) {
    try {
        const { uuid } = req.body;

        if (!uuid) {
            return res.status(400).json({ error: "uuid required" });
        }

        await PlayerService.removeOp(req.params.id as string, uuid);
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * POST /servers/:id/players/whitelist
 */
export async function addWhitelist(req: Request, res: Response) {
    try {
        const { uuid, username } = req.body;

        if (!uuid || !username) {
            return res.status(400).json({ error: "uuid and username required" });
        }

        await PlayerService.addWhitelist(req.params.id as string, uuid, username);
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * DELETE /servers/:id/players/whitelist/:uuid
 */
export async function removeWhitelist(req: Request, res: Response) {
    try {
        await PlayerService.removeWhitelist(req.params.id as string, req.params.uuid as string);
        res.json({ ok: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
