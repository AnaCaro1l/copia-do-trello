import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Card } from '../../models/Card';
import { List } from '../../models/List';

export const DeleteCardService = async (id: string): Promise<void> => {
  // include the related List so we can access its workspaceId
  const card = await Card.findByPk(id, { include: [List] });

  if (!card) {
    throw new AppError('Card não encontrado');
  }

  // card.list may be undefined if association wasn't loaded properly or DB is in an inconsistent state.
  // In that case, try to load the List explicitly using the foreign key.
  let list = card.list as List | undefined;
  if (!list && card.listId) {
    list = await List.findByPk(card.listId);
  }

  if (!list || !list.workspaceId) {
    // If we still don't have the workspaceId, send a safer error instead of throwing a raw TypeError.
    throw new AppError('Lista ou workspace do card não encontrado');
  }

  io.to(`workspace_${list.workspaceId}`).emit('delete_card', card);
  await card.destroy();
};
