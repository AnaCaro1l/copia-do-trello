import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';
import { IncludeOptions } from 'sequelize';

export const ListWorkspacesServices = async (
  userId: number
): Promise<Workspace[]> => {

  let includeOptions: IncludeOptions[] = []
  const workspaces = await Workspace.findAll({
    where: { ownerId: userId },
    include: ['collaborators', ...includeOptions],
  });

  for (const workspace of workspaces) {
    const lists = await List.findAll({
      where: { workspaceId: workspace.id },
    })

    if(lists.length > 0) {
      includeOptions.push({ model: List, as: 'lists', include: ['cards'] })
    }
  }
  
  return workspaces;
};
