import { AppError } from '../../errors/AppError';
import { Card } from '../../models/Card';

export const ShowCardService = async (id: string): Promise<Card> => {
  const card = await Card.findByPk(id);
  if (!card) {
    throw new AppError('Card não encontrado');
  }
  return card;
};
