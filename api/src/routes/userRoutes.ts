import { Router } from 'express';
import { createUser } from '../controllers/UserController';

const router = Router();

router.post('/user', createUser);

export default router;