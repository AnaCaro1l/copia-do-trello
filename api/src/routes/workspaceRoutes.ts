import { Router } from 'express';
import upload from '../middlewares/multer.middleware';
import { isAuth } from '../middlewares/isAuth';
import { addCollaborators, deleteWorkspace, insert, listWorkspaces, removeCollaborators, showWorkspace, updateWorkspace } from '../controllers/WorkspaceController';

const router = Router();

router.post('/workspace', isAuth, upload.single('backgroundPath'), insert);

router.get('/workspaces', isAuth, listWorkspaces);

router.post('/workspace/collaborators', isAuth, addCollaborators);

router.delete('/workspace/collaborators', isAuth, removeCollaborators);

router.get('/workspace/:id', isAuth, showWorkspace);

router.put('/workspace/:id', isAuth, upload.single('backgroundPath'), updateWorkspace);

router.delete('/workspace/:id', isAuth, deleteWorkspace);

export default router;