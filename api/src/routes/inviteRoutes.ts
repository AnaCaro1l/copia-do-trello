import { Router } from 'express';
import {
  listInvites,
  showInvite,
  validateInvite,
} from '../controllers/InviteController';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.post('/invite/validate', isAuth, validateInvite);

router.get('/invite/:id', isAuth, showInvite);

router.get('/invites', isAuth, listInvites);

export default router;
