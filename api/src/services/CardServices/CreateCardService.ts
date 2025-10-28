import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Card } from '../../models/Card';
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

  // position: append to the end of the list
  const maxPosition = (await Card.max('position', { where: { listId } })) as number | null;
  const nextPosition = Number.isFinite(maxPosition as number) && maxPosition !== null ? (maxPosition as number) + 1 : 0;

  const card = await Card.create({
    title,
    description,
    listId,
    media,
    position: nextPosition,
  });

  if (card.list.workspace.collaborators && card.list.workspace.collaborators.length > 0) {
    io.to(`workspace_${card.list.workspaceId}`).emit('show_new_card', card);
  }

  return card;
};
