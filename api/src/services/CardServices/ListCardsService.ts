import { Card } from '../../models/Card';

export const ListCardsService = async (listId: number): Promise<Card[]> => {
  const cards = await Card.findAll({
    where: { listId: listId },
  });
  return cards;
};
