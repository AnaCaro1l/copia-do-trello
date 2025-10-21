import { Router } from 'express';
import {
  createCard,
  deleteCard,
  listCards,
  showCard,
  updateCard,
} from '../controllers/CardController';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.post('/card', isAuth, createCard);

router.get('/cards/:listId', isAuth, listCards);

router.get('/card/:id', isAuth, showCard);

router.put('/card/:id', isAuth, updateCard);

router.delete('/card/:id', isAuth, deleteCard);

export default router;
