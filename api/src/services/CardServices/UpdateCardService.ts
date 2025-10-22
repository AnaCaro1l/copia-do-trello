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
  dueDate,
  color,
}: Request): Promise<Card> => {
  const card = await Card.findByPk(id);
  if (!card) {
    throw new Error('Card not found');
  }

  let media = null;
  if (mediaPath) {
    media = await uploadOnCloudinary(mediaPath);
  }

  if(dueDate) {
    dueDate = new Date(dueDate);
  }

  const updatedCard = await card.update({
    title: title ? title : card.title,
    description: description ? description : card.description,
    media: media ? media : card.media,
    completed: completed ? completed : card.completed,
    listId: listId ? listId : card.listId,
    dueDate: dueDate ? dueDate : card.dueDate,
    color: color ? color : card.color,
    updatedAt: new Date(),
  });

  io.to(`workspace_${card.listId}`).emit('show_updated_card', updatedCard);
  return updatedCard;
};
