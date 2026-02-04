// players.routes.ts
import { Router } from "express";
import * as PlayersController from "./players.controller";

const router = Router({ mergeParams: true });

router.get("/", PlayersController.getPlayers);

router.post("/ban", PlayersController.banPlayer);
router.post("/unban", PlayersController.unbanPlayer);
router.post("/kick", PlayersController.kickPlayer);

router.post("/op", PlayersController.setOp);
router.post("/deop", PlayersController.removeOp);

router.post("/whitelist", PlayersController.addWhitelist);
router.delete("/whitelist/:uuid", PlayersController.removeWhitelist);

export default router;
