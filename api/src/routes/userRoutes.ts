import { Router } from 'express';
import {
  addUser,
  deleteUser,
  listUsers,
  showUser,
  updateUser,
} from '../controllers/UserController';
import { login } from '../controllers/SessionController';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.post('/user', addUser);

router.post('/login', login);

router.get('/users', isAuth, listUsers);

router.put('/user', isAuth, updateUser);

router.get('/user/:id', isAuth, showUser);

router.delete('/user/:id', isAuth, deleteUser);

export default router;
