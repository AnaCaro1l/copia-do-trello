import { List } from '../../models/List';

export const ListListsService = async (
  workspaceId: number
): Promise<List[]> => {
  const lists = await List.findAll({
    where: { workspaceId: workspaceId },
    include: ['cards'],
  });
  return lists;
};
