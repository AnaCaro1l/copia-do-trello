import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';

interface UserData {
  name?: string;
  email?: string;
  password?: string;
}

interface Request {
  id: number;
  userData: UserData;
}

export const UpdateUserService = async ({
  id,
  userData,
}: Request): Promise<User> => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Usuário não encontrado');
  }

  let {
    name,
    email,
    password,
  } = userData;

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
    ...userData,
  });

  return updatedUser;
};
