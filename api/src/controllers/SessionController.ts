import { Request, Response } from 'express';
import { User } from '../models/User';
import { AppError } from '../errors/AppError';
import { AuthUserService } from '../services/UserServices/AuthUserService';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email: email },
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const token = await AuthUserService({ email, password });

  return res.status(201).json({
    token,
    user,
  });
};
