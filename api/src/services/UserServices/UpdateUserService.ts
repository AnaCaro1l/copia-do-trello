import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';

interface Request {
  id: number;
  name?: string;
  email?: string;
  password?: string;
}

export const UpdateUserService = async ({
  id,
  name,
  email,
  password,
}: Request): Promise<User> => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Usuário não encontrado');
  }

  if (password) {
    const isOldPassword = await bcrypt.compare(password, user.passwordHash);
    if (isOldPassword) {
      throw new AppError('A nova senha deve ser diferente da anterior');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    password = passwordHash;
  }

  const updatedUser = await user.update({
    name: name ? name : user.name,
    email: email ? email : user.email,
    passwordHash: password ? password : user.passwordHash,
    updatedAt: new Date(),
  });

  return updatedUser;
};
