import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';
import { IncludeOptions } from 'sequelize';

export const ListWorkspacesServices = async (
  userId: number
): Promise<Workspace[]> => {
  const workspaces = await Workspace.findAll({
    where: { ownerId: userId },
    include: ['collaborators'],
  });

  return workspaces;
};
