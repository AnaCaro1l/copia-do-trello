import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Invite } from '../../models/Invite';

export const ShowInviteService = async (id: string) => {
  const invite = await Invite.findByPk(id);

  if (!invite) {
    throw new AppError('Convite não encontrado');
  }

  io.to(`workspace_${invite.workspaceId}`).emit('view_invite', invite);

  return invite;
};
