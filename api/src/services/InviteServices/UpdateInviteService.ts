import { AppError } from '../../errors/AppError';
import { Invite } from '../../models/Invite';

interface InviteData {
  senderId?: number;
  receiverId?: number;
  workspaceId?: number;
  status?: 'pending' | 'accepted' | 'declined';
}

interface Request {
  id: number;
  inviteData: InviteData;
}

export const UpdateInviteService = async ({
  id,
  inviteData,
}: Request) => {
  const invite = await Invite.findOne({
    where: { id: id },
  });

  if (!invite) {
    throw new AppError('Convite não encontrado');
  }

  const {
    senderId,
    receiverId,
    workspaceId,
    status,
  } = inviteData;

  const updatedInvite = await invite.update({
    ...inviteData,
  });

  return updatedInvite;
};
