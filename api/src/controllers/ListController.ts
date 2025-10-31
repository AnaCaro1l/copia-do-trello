import { Request, Response } from 'express';
import { CreateListService } from '../services/ListServices/CreateListService';
import { ListListsService } from '../services/ListServices/ListListsService';
import { ShowListService } from '../services/ListServices/ShowListService';
import { DeleteListService } from '../services/ListServices/DeleteListService';
import { UpdateListService } from '../services/ListServices/UpdateListService';

export const createList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, workspaceId } = req.body;

  const list = await CreateListService({ title, workspaceId });

  return res.status(201).json({
    message: 'Lista criada com sucesso',
    list,
  });
};

export const listLists = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const workspaceId = req.params.workspaceId;
  const lists = await ListListsService(Number(workspaceId));
  return res.status(200).json({
    message: 'Listas listadas com sucesso',
    lists,
  });
};

export const showList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const list = await ShowListService(id);
  return res.status(200).json({
    message: 'Lista encontrada com sucesso',
    list,
  });
};

export const updateList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const listData = req.body;
  const list = await UpdateListService({ id, listData });
  return res.status(200).json({
    message: 'Lista atualizada com sucesso',
    list,
  });
};

export const deleteList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  await DeleteListService(id);
  return res.status(204).json({
    message: 'Lista deletada com sucesso',
  });
};
