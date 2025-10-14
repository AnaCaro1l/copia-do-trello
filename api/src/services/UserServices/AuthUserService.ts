import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

interface Request {
  email: string;
  password: string;
}

export const AuthUserService = async ({
  email,
  password,
}: Request): Promise<string> => {
  const user = await User.findOne({
    where: { email: email },
  });

  if (!user) {
    throw new AppError('Email ou senha inválidos');
  }

  const checkPassword = await bcrypt.compare(password, user.passwordHash);

  if (!checkPassword) {
    throw new AppError('Email ou senha inválidos');
  }

  const token = sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  return token;
};
