import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';

export const ShowUserService = async (id: string): Promise<User> => {
  const user = await User.findOne({
    where: { id: id },
    attributes: { exclude: ['passwordHash'] },
    include: ['workspaces', 'invites'],
  });

  if (!user) {
    throw new AppError('Usuário não encontrado');
  }

  return user;
};
