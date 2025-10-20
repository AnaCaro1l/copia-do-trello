import { Router } from "express";
import { listInvites, showInvite, validateInvite } from "../controllers/InviteController";
import { isAuth } from "../middlewares/isAuth";

const router = Router();

router.get("/invite/:id", isAuth, showInvite);

router.get("/invites/:id", isAuth, listInvites);

router.post("/invite/validate", isAuth, validateInvite);

export default router;