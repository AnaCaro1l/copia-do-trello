import io from '../../app';
import { Card } from '../../models/Card';
import uploadOnCloudinary from '../../utils/cloudinary';
import { sequelize } from '../../database';
import { Op } from 'sequelize';
import { AppError } from '../../errors/AppError';

interface Request {
  title?: string;
  description?: string;
  mediaPath?: string;
  id: string;
  completed?: boolean;
  listId?: number;
  position?: number;
  dueDate?: Date;
  color?: string;
}

export const UpdateCardService = async ({
  title,
  description,
  mediaPath,
  id,
  completed,
  listId,
  position,
  dueDate,
  color,
}: Request): Promise<Card> => {
  const card = await Card.findByPk(id);
  if (!card) {
    throw new AppError('Card não encontrado');
  }

  let media = null;
  if (mediaPath) {
    media = await uploadOnCloudinary(mediaPath);
  }

  if(dueDate) {
    dueDate = new Date(dueDate);
  }

 
  const oldListId = card.listId;
  const oldPos = card.position;
  const targetListId = typeof listId === 'number' ? listId : oldListId;

  let newPos = typeof position === 'number' ? position : undefined;

  const updatedCard = await sequelize.transaction(async (t) => {

    if (targetListId !== oldListId) {
      // 1) Close gap in old list
      await Card.increment('position', {
        by: -1,
        where: {
          listId: oldListId,
          position: { [Op.gt]: oldPos },
        },
        transaction: t,
      });

      // 2) Determine insert position in target list
      const maxTargetPos = (await Card.max('position', {
        where: { listId: targetListId },
        transaction: t,
      })) as number | null;
      const endPos = Number.isFinite(maxTargetPos as number) && maxTargetPos !== null ? (maxTargetPos as number) + 1 : 0;
      if (newPos === undefined || newPos > endPos) newPos = endPos;
      if (newPos < 0) newPos = 0;

      // 3) Make room in target list from newPos onwards
      await Card.increment('position', {
        by: 1,
        where: {
          listId: targetListId,
          position: { [Op.gte]: newPos },
        },
        transaction: t,
      });

      // 4) Update the card
      return await card.update(
        {
          title: title ?? card.title,
          description: description ?? card.description,
          media: media ?? card.media,
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

    // Same list: handle reorder if position provided
    if (typeof newPos === 'number' && newPos !== oldPos) {
      // Determine bounds in current list
      const maxPos = (await Card.max('position', {
        where: { listId: oldListId },
        transaction: t,
      })) as number | null;
      const endPos = Number.isFinite(maxPos as number) && maxPos !== null ? (maxPos as number) : 0;
      if (newPos > endPos) newPos = endPos;
      if (newPos < 0) newPos = 0;

      if (newPos > oldPos) {
        // shift down those between oldPos+1 .. newPos
        await Card.increment('position', {
          by: -1,
          where: {
            listId: oldListId,
            position: { [Op.and]: [{ [Op.gt]: oldPos }, { [Op.lte]: newPos }] },
          },
          transaction: t,
        });
      } else if (newPos < oldPos) {
        // shift up those between newPos .. oldPos-1
        await Card.increment('position', {
          by: 1,
          where: {
            listId: oldListId,
            position: { [Op.and]: [{ [Op.gte]: newPos }, { [Op.lt]: oldPos }] },
          },
          transaction: t,
        });
      }

      return await card.update(
        {
          title: title ?? card.title,
          description: description ?? card.description,
          media: media ?? card.media,
          completed: completed ?? card.completed,
          position: newPos,
          dueDate: dueDate ?? card.dueDate,
          color: color ?? card.color,
          updatedAt: new Date(),
        },
        { transaction: t }
      );
    }

    // Fallback: no move/reorder, just update fields
    return await card.update(
      {
        title: title ?? card.title,
        description: description ?? card.description,
        media: media ?? card.media,
        completed: completed ?? card.completed,
        listId: listId ?? card.listId,
        dueDate: dueDate ?? card.dueDate,
        color: color ?? card.color,
        updatedAt: new Date(),
      },
      { transaction: t }
    );
  });

  io.to(`workspace_${card.listId}`).emit('show_updated_card', updatedCard);
  return updatedCard;
};
