import { Router } from "express";
import { createCard, listCards, showCard, updateCard } from "../controllers/CardController";

const router = Router();

router.post('/card', createCard);

router.get('/cards/:listId', listCards);

router.get('/card/:id', showCard);

router.put('/card/:id', updateCard);

export default router;