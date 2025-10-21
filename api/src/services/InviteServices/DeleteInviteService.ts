import { AppError } from '../../errors/AppError';
import { Invite } from '../../models/Invite';

export const DeleteInviteService = async (id: number): Promise<void> => {
  const invite = await Invite.findOne({
    where: { id: id },
  });

  if (!invite) {
    throw new AppError('Convite não encontrado');
  }

  await invite.destroy();
};
