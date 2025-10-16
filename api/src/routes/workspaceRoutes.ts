import { Router } from 'express';
import upload from '../middlewares/multer.middleware';
import { isAuth } from '../middlewares/isAuth';
import { addCollaborators, deleteWorkspace, insert, listWorkspaces, showWorkspace, updateWorkspace } from '../controllers/WorkspaceController';

const router = Router();

router.post('/workspace', isAuth, upload.single('backgroundPath'), insert);

router.get('/workspaces', isAuth, listWorkspaces);

router.get('/workspace/:id', isAuth, showWorkspace);

router.put('/workspace/:id', isAuth, upload.single('backgroundPath'), updateWorkspace);

router.delete('/workspace/:id', isAuth, deleteWorkspace);

router.post('/workspace/collaborators', isAuth, addCollaborators);

export default router;