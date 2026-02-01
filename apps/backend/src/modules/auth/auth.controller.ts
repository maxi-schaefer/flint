import { Request, Response } from "express";
import * as AuthService from "./auth.service";

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing credentials" });
    }

    const result = await AuthService.login(email, password);

    if (!result) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json(result);
}