import { Router } from 'express';
import { addUser, showUser } from '../controllers/UserController';
import { login } from '../controllers/SessionController';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.post('/user', addUser);

router.post('/login', login);

router.get('/user/:id', showUser);

export default router;
