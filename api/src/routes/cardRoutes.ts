import { Router } from "express";
import { createCard, deleteCard, listCards, showCard, updateCard } from "../controllers/CardController";

const router = Router();

router.post('/card', createCard);

router.get('/cards/:listId', listCards);

router.get('/card/:id', showCard);

router.put('/card/:id', updateCard);

router.delete('/card/:id', deleteCard);

export default router;