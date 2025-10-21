import { IncludeOptions } from 'sequelize';
import { List } from '../../models/List';
import { Card } from '../../models/Card';

export const ListListsService = async (
  workspaceId: number
): Promise<List[]> => {
  let includeOptions: IncludeOptions[] = [];
  const lists = await List.findAll({
    where: { workspaceId: workspaceId },
    include: includeOptions,
  });

  for (const list of lists) {
    const cards = await Card.findAll({
      where: { listId: list.id },
    });

    if (cards.length > 0) {
      includeOptions.push({ model: Card, as: 'cards' });
    }
  }
  return lists;
};
