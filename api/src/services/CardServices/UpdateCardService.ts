import io from '../../app';
import { Card } from '../../models/Card';
import uploadOnCloudinary from '../../utils/cloudinary';
import { sequelize } from '../../database';
import { AppError } from '../../errors/AppError';
import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';

interface CardData {
  title?: string;
  description?: string;
  completed?: boolean;
  listId?: number;
  position?: number;
  dueDate?: Date;
  color?: string;
}

interface Request {
  id: string;
  cardData: CardData;
}

export const UpdateCardService = async ({
  id,
  cardData,
}: Request): Promise<Card> => {
  const card = await Card.findOne({
    where: { id },
    include: [
      {
        model: List,
        as: 'list',
        include: [{ model: Workspace, as: 'workspace' }],
      },
    ],
  });

  if (!card) throw new AppError('Card não encontrado');

  const {
    title,
    description,
    completed,
    listId,
    position,
    dueDate,
    color,
  } = cardData;

  const currentListId = card.listId;
  const targetListId = listId ?? currentListId;

  const oldListCards = await Card.findAll({
    where: { listId: currentListId },
    order: [['position', 'ASC']],
  });

  const newListCards = await Card.findAll({
    where: { listId: targetListId },
    order: [['position', 'ASC']],
  });

  const updatedCard = await sequelize.transaction(async (t) => {
    if (targetListId !== currentListId) {
      const oldIndex = oldListCards.findIndex((c) => c.id === card.id);
      if (oldIndex >= 0) oldListCards.splice(oldIndex, 1);

      let newPos = position;
      if (newPos < 0 || newPos > newListCards.length) {
        throw new AppError('Posição inválida');
      } 

      newListCards.splice(newPos, 0, card);

      await Promise.all([
        ...oldListCards.map((c, i) =>
          c.update({ position: i }, { transaction: t })
        ),
        ...newListCards.map((c, i) =>
          c.update({ position: i, listId: targetListId }, { transaction: t })
        ),
      ]);

      return await card.update({ ...cardData }, { transaction: t });
    }

    if (position && position !== card.position) {
      const cards = [...oldListCards];
      const oldIndex = cards.findIndex((c) => c.id === card.id);
      if (oldIndex >= 0) cards.splice(oldIndex, 1);

      let newPos = position;
      if (newPos < 0) newPos = 0;
      if (newPos > cards.length) newPos = cards.length;

      cards.splice(newPos, 0, card);

      await Promise.all(
        cards.map((c, i) =>
          c.update({ position: i }, { transaction: t })
        )
      );

      return await card.update(cardData, { transaction: t });
    }

    return await card.update(cardData, { transaction: t });
  });

  io.to(`workspace_${card.list.workspaceId}`).emit(
    'show_updated_card',
    updatedCard
  );

  return updatedCard;
};
