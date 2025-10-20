import { Router } from "express";
import { listInvites, showInvite } from "../controllers/InviteController";

const router = Router();

router.get("/invite/:id", showInvite);

router.get("/invites/:id", listInvites);

export default router;