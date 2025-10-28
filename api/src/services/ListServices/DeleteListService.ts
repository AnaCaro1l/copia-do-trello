import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Card } from '../../models/Card';
import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';

export const DeleteListService = async (id: string): Promise<void> => {
  const list = await List.findOne({
    where: { id: id },
    include: [{ model: Workspace, as: 'workspace' }],
  });

  if (!list) {
    throw new AppError('Lista não encontrada');
  }

  const cards = await Card.findAll({
    where: {
      listId: id,
    },
  });

  for (const card of cards) {
    await card.destroy();
  }

  io.to(`workspace_${list.workspaceId}`).emit('delete_list', list);

  await list.destroy();
};
