import { AppError } from '../../errors/AppError';
import { Invite } from '../../models/Invite';

interface Request {
  id: number;
  senderId?: number;
  receiverId?: number;
  workspaceId?: number;
  status?: 'pending' | 'accepted' | 'declined';
}

export const UpdateInviteService = async ({
  id,
  senderId,
  receiverId,
  workspaceId,
  status,
}: Request) => {
  const invite = await Invite.findOne({
    where: { id: id },
  });

  if (!invite) {
    throw new AppError('Convite não encontrado');
  }

  const updatedInvite = await invite.update({
    senderId: senderId ? senderId : invite.senderId,
    receiverId: receiverId ? receiverId : invite.receiverId,
    workspaceId: workspaceId ? workspaceId : invite.workspaceId,
    status: status ? status : invite.status,
    updatedAt: new Date(),
  });

  return updatedInvite;
};
