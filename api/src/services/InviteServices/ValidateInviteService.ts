import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Invite } from '../../models/Invite';
import { ShowUserService } from '../UserServices/ShowUserService';
import { ShowWorkspaceService } from '../WorkspaceServices/ShowWorkspaceService';
import { UpdateInviteService } from './UpdateInviteService';

interface Request {
  status: 'accepted' | 'declined';
  inviteId: number;
}

export const ValidateInviteService = async ({ status, inviteId }: Request) => {
  const invite = await Invite.findOne({
    where: { id: inviteId },
  });
  const id = String(invite.workspaceId);
  const workspace = await ShowWorkspaceService({
    id: id,
    userId: invite.senderId,
  });

  if (!invite) {
    throw new AppError('Convite não encontrado');
  }
  const inviteData = {
    status,
  };
  if (status === 'accepted') {
    await UpdateInviteService({ id: inviteId, inviteData });
    const user = await ShowUserService(String(invite.receiverId));
    await workspace.$add('collaborators', user);

    const enriched = await ShowWorkspaceService({ id, userId: invite.receiverId });

    io.to(`user_${invite.receiverId}`).emit('show_new_workspace', enriched);

    io.to(`workspace_${invite.workspaceId}`).emit('validate_invite', invite);

    return invite;
  }

  if (status === 'declined') {
    await UpdateInviteService({ id: inviteId, inviteData });
    return invite;
  }

  return invite;
};
