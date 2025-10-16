import { AppError } from '../../errors/AppError';
import { Card } from '../../models/Card';

export const DeleteCardService = async (id: string): Promise<void> => {
  const card = await Card.findByPk(id);

  if (!card) {
    throw new AppError('Card não encontrado');
  }

  await card.destroy();
};
