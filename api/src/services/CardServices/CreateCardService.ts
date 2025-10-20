import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Card } from '../../models/Card';
import uploadOnCloudinary from '../../utils/cloudinary';
import { CardSchemas } from './schemas';

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

  const card = await Card.create({
    title,
    description,
    listId,
    media,
  });

  return card;
};
