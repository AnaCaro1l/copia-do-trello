import { AppError } from '../../errors/AppError';
import { Invite } from '../../models/Invite';
import { User } from '../../models/User';
import { Workspace } from '../../models/Workspace';

export const ListInvitesService = async (receiverId: number) => {
  const invites = await Invite.findAll({
    where: {
      receiverId: receiverId,
    },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'name'],
      },
      {
        model: Workspace,
        as: 'workspace',
        attributes: ['id', 'name'],
      },
    ],
  });

  return invites;
};
