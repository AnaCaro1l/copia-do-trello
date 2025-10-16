import { List } from '../../models/List';

export const ShowListService = async (id: string): Promise<List | null> => {
  const list = await List.findOne({
    where: { id: id },
    include: ['cards'],
  });
  return list;
};
