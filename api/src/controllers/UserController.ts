import { Request, Response } from 'express';
import { CreateUserService } from '../services/UserServices/CreateUserService';
import { ShowUserService } from '../services/UserServices/ShowUserService';
import { ListUsersService } from '../services/UserServices/ListUsersService';
import { DeleteUserService } from '../services/UserServices/DeleteUserService';
import { UpdateUserService } from '../services/UserServices/UpdateUserService';

export const addUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password } = req.body;
  const user = await CreateUserService({ name, email, password });
  return res.status(201).json({
    message: 'Usuário criado com sucesso',
    user,
  });
};

export const showUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const user = await ShowUserService(id);
  return res.status(200).json({
    user,
  });
};

export const listUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users = await ListUsersService();
  return res.status(200).json({
    message: 'Usuários listados com sucesso',
    users,
  });
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  await DeleteUserService(id);
  return res.status(204).json({
    message: 'Usuário deletado com sucesso',
  });
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.user.id;
  const { name, email, password } = req.body;
  const updatedUser = await UpdateUserService({ id, name, email, password });
  return res.status(200).json({
    message: 'Usuário atualizado com sucesso',
    updatedUser,
  });
};
