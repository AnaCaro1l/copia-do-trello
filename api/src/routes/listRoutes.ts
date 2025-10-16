import { Router } from "express";
import { createList, deleteList, listLists, showList, updateList } from "../controllers/ListController";

const router = Router();

router.post('/list', createList);

router.get('/lists/:workspaceId', listLists);

router.get('/list/:id', showList);

router.put('/list/:id', updateList);

router.delete('/list/:id', deleteList);

export default router;