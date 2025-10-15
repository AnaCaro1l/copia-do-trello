import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Sessão Expirada', 401);
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    throw new AppError('Token inválido', 401);
  }

  try {
    const decode = verify(token, process.env.JWT_SECRET);
    const { id, name, email } = decode;
    req.user = {
      id: id,
      name: name,
      email: email,
    };
  } catch (err) {
    throw new AppError('Token inválido', 401);
  }

  return next();
};
