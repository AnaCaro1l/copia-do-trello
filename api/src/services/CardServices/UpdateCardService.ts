import io from '../../app';
import { Card } from '../../models/Card';
import uploadOnCloudinary from '../../utils/cloudinary';
import { sequelize } from '../../database';
import { Op } from 'sequelize';
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
    where: { id: id },
    include: [
      {
        model: List,
        as: 'list',
        include: [{ model: Workspace, as: 'workspace' }],
      },
    ],
  });
  if (!card) {
    throw new AppError('Card não encontrado');
  }

  let {
    title,
    description,
    completed,
    listId,
    position,
    dueDate,
    color,
  } = cardData;

  let media = null;

  if (dueDate) {
    dueDate = new Date(dueDate);
  }

  const currentListId = card.listId;
  const currentPos = card.position;
  const targetListId = listId ? listId : currentListId;

  let newPos = position ? position : undefined;

  const updatedCard = await sequelize.transaction(async (t) => {

    if (targetListId !== currentListId) {

      await Card.increment('position', {
        by: -1,
        where: {
          listId: currentListId,
          position: { [Op.gt]: currentPos },
        },
        transaction: t,
      });

      const maxTargetPos = (await Card.max('position', {
        where: { listId: targetListId },
        transaction: t,
      })) as number | null;
      const endPos =
        maxTargetPos as number && maxTargetPos !== null
          ? (maxTargetPos as number) + 1
          : 0;
      if (newPos === undefined || newPos > endPos) newPos = endPos;
      if (newPos < 0) newPos = 0;

      await Card.increment('position', {
        by: 1,
        where: {
          listId: targetListId,
          position: { [Op.gte]: newPos },
        },
        transaction: t,
      });

      return await card.update(
        {
          title: title ?? card.title,
          description: description ?? card.description,
          completed: completed ?? card.completed,
          listId: targetListId,
          position: newPos,
          dueDate: dueDate ?? card.dueDate,
          color: color ?? card.color,
          updatedAt: new Date(),
        },
        { transaction: t }
      );
    }

    if (typeof newPos === 'number' && newPos !== currentPos) {
      const maxPos = (await Card.max('position', {
        where: { listId: currentListId },
        transaction: t,
      })) as number | null;
      const endPos =
        maxPos as number && maxPos !== null
          ? (maxPos as number)
          : 0;
      if (newPos > endPos) newPos = endPos;
      if (newPos < 0) newPos = 0;

      if (newPos > currentPos) {
        await Card.increment('position', {
          by: -1,
          where: {
            listId: currentListId,
            position: { [Op.and]: [{ [Op.gt]: currentPos }, { [Op.lte]: newPos }] },
          },
          transaction: t,
        });
      } else if (newPos < currentPos) {
        await Card.increment('position', {
          by: 1,
          where: {
            listId: currentListId,
            position: { [Op.and]: [{ [Op.gte]: newPos }, { [Op.lt]: currentPos }] },
          },
          transaction: t,
        });
      }

      return await card.update(
        {
          ...cardData,
        },
        { transaction: t }
      );
    }

    return await card.update(
      {
        ...cardData,
      },
      { transaction: t }
    );
  });

  io.to(`workspace_${card.list.workspaceId}`).emit(
    'show_updated_card',
    updatedCard
  );

  return updatedCard;
};
