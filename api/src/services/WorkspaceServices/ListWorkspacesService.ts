import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';
import { Op } from 'sequelize';

export const ListWorkspacesServices = async (
  userId: number
): Promise<Workspace[]> => {
  const workspaces = await Workspace.findAll({
    where: {
      [Op.or]: [
        { ownerId: userId },
        { '$collaborators.id$': userId },
      ],
    },
    include: [
      {
        association: 'collaborators',
        attributes: ['id', 'name', 'email'],
        through: { attributes: [] },
        required: false,
      },
      { model: List, as: 'lists', include: ['cards'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  return workspaces;
};
