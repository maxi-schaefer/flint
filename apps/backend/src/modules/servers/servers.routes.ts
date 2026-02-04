import { Router } from "express";
import * as ServersController from "./servers.controller";
import PlayerRoutes from "../players/players.routes";

const router = Router();

router.post("/", ServersController.createServer);
router.get("/", ServersController.listServers);
router.get("/:id", ServersController.getServer);

router.post("/:id/start", ServersController.startServer);
router.post("/:id/stop", ServersController.stopServer);
router.post("/:id/command", ServersController.sendCommand);

router.get("/:id/logs", ServersController.getLogs);

router.get("/:id/files", ServersController.listFiles);
router.get("/:id/file", ServersController.readFile);
router.post("/:id/file", ServersController.writeFile);

router.use("/:id/players", PlayerRoutes);

export default router;