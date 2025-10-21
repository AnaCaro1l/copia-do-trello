import { AppError } from '../../errors/AppError';
import { Invite } from '../../models/Invite';
import { User } from '../../models/User';
import { Workspace } from '../../models/Workspace';

export const ListInvitesService = async (id: number) => {
  const invites = await Invite.findAll({
    where: {
      receiverId: id,
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
