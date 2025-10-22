import { Request, Response } from 'express';
import { CreateCardService } from '../services/CardServices/CreateCardService';
import { ListCardsService } from '../services/CardServices/ListCardsService';
import { ShowCardService } from '../services/CardServices/ShowCardService';
import { UpdateCardService } from '../services/CardServices/UpdateCardService';
import { DeleteCardService } from '../services/CardServices/DeleteCardService';

export const createCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, description, listId } = req.body;
  const mediaPath = req.file?.path;

  const card = await CreateCardService({
    title,
    description,
    listId,
    mediaPath,
  });

  return res.status(201).json({
    message: 'Card criado com sucesso',
    card,
  });
};

export const listCards = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const listId = req.params.listId;
  const cards = await ListCardsService(Number(listId));
  return res.status(200).json({
    message: 'Cards listados com sucesso',
    cards,
  });
};

export const showCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const card = await ShowCardService(id);
  return res.status(200).json({
    message: 'Card encontrado com sucesso',
    card,
  });
};

export const updateCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const { title, description, completed, dueDate, color } = req.body;
  const mediaPath = req.file?.path;

  const card = await UpdateCardService({
    title,
    description,
    mediaPath,
    id,
    completed,
    dueDate,
    color,
  });

  return res.status(200).json({
    message: 'Card atualizado com sucesso',
    card,
  });
};

export const deleteCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  await DeleteCardService(id);
  return res.status(204).json({
    message: 'Card deletado com sucesso',
  });
};
