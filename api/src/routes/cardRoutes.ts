import { Router } from "express";
import { createCard, listCards, showCard } from "../controllers/CardController";

const router = Router();

router.post('/card', createCard);

router.get('/cards/:listId', listCards);

router.get('/card/:id', showCard);

export default router;