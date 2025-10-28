import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Card } from '../../models/Card';
import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';
import uploadOnCloudinary from '../../utils/cloudinary';
import { CardSchemas } from './schemas';
import { Op } from 'sequelize';

interface Request {
  title: string;
  description?: string;
  listId: number;
  mediaPath?: string;
}

export const CreateCardService = async ({
  title,
  description,
  listId,
  mediaPath,
}: Request): Promise<Card> => {
  await CardSchemas.createCard.validate({ title, description });

  if (!listId) {
    throw new AppError('Lista não encontrada');
  }

  let media = null;
  if (mediaPath) {
    media = await uploadOnCloudinary(mediaPath);
  }

  const maxPosition = (await Card.max('position', { where: { listId } })) as
    | null;
  const nextPosition =
    Number.isFinite(maxPosition as number) && maxPosition !== null
      ? (maxPosition as number) + 1
      : 0;

  const newCard = await Card.create({
    title,
    description,
    listId,
    media,
    position: nextPosition,
  });

  const card = await Card.findOne({
    where: { id: newCard.id },
    include: [{ model: List, as: 'list' }],
  });

  io.to(`workspace_${card.list.workspaceId}`).emit('show_new_card', card);

  return card;
};
