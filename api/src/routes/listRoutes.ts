import { Router } from "express";
import { createList, deleteList, listLists, showList, updateList } from "../controllers/ListController";
import { isAuth } from "../middlewares/isAuth";

const router = Router();

router.post('/list', isAuth, createList);

router.get('/lists/:workspaceId', isAuth, listLists);

router.get('/list/:id', isAuth, showList);

router.put('/list/:id', isAuth, updateList);

router.delete('/list/:id', isAuth, deleteList);

export default router;