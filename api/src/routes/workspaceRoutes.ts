import { Router } from 'express';
import upload from '../middlewares/multer.middleware';
import { isAuth } from '../middlewares/isAuth';
import { insert } from '../controllers/WorkspaceController';

const router = Router();

router.post('/workspace', isAuth, upload.single('backgroundPath'), insert);

export default router;