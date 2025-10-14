import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';

export const DeleteUserService = async (id: string): Promise<void> => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new AppError('Usuário não encontrado');
  }
  await user.destroy();
};
