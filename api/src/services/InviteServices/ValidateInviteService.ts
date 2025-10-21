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

  if (status === 'accepted') {
    await UpdateInviteService({ id: inviteId, status: 'accepted' });
    const user = await ShowUserService(String(invite.receiverId));
    await workspace.$add('collaborators', user);
    return invite;
  }

  if (status === 'declined') {
    await UpdateInviteService({ id: inviteId, status: 'declined' });
    return invite;
  }

  return invite;
};
