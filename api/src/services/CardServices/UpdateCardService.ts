import io from '../../app';
import { Card } from '../../models/Card';
import uploadOnCloudinary from '../../utils/cloudinary';

interface Request {
  title?: string;
  description?: string;
  mediaPath?: string;
  id: string;
  completed?: boolean;
  listId?: number;
}

export const UpdateCardService = async ({
  title,
  description,
  mediaPath,
  id,
  completed,
  listId
}: Request): Promise<Card> => {
  const card = await Card.findByPk(id);
  if (!card) {
    throw new Error('Card not found');
  }

  let media = null;
  if (mediaPath) {
    media = await uploadOnCloudinary(mediaPath);
  }

  const updatedCard = await card.update({
    title: title ? title : card.title,
    description: description ? description : card.description,
    media: media ? media : card.media,
    completed: completed ? completed : card.completed,
    listId: listId ? listId : card.listId,
    updatedAt: new Date(),
  });

  io.to(`list_${card.listId}`).emit('show_updated_card', updatedCard);
  return updatedCard;
};
