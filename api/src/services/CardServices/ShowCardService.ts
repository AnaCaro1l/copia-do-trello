import { Card } from '../../models/Card';

export const ShowCardService = async (id: string): Promise<Card | null> => {
  const card = await Card.findByPk(id);
  return card;
};
