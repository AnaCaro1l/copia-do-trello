import { Router } from "express";
import { createList, listLists, showList } from "../controllers/ListController";

const router = Router();

router.post('/list', createList);

router.get('/lists/:workspaceId', listLists);

router.get('/list/:id', showList);

export default router;