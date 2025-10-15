import { Router } from 'express';
import upload from '../middlewares/multer.middleware';
import { isAuth } from '../middlewares/isAuth';
import { insert, listWorkspaces, showWorkspace } from '../controllers/WorkspaceController';

const router = Router();

router.post('/workspace', isAuth, upload.single('backgroundPath'), insert);

router.get('/workspaces', isAuth, listWorkspaces);

router.get('/workspace/:id', isAuth, showWorkspace);

export default router;