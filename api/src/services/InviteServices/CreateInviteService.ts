import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Invite } from '../../models/Invite';
import { InviteSchemas } from './schemas';

interface Request {
  senderId: number;
  receiverId: number;
  workspaceId: number;
}

export const CreateInviteService = async ({
  senderId,
  receiverId,
  workspaceId,
}: Request): Promise<Invite> => {
  await InviteSchemas.createInvite.validate({
    senderId,
    receiverId,
    workspaceId,
  });

  const invite = await Invite.create({
    senderId,
    receiverId,
    workspaceId,
    status: 'pending',
  });

  io.to(`user_${receiverId}`).emit('show_new_invite', invite);
  return invite;
};
