import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Card } from '../../models/Card';
import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';
import { User } from '../../models/User';

export const DeleteCardService = async (id: string): Promise<void> => {
  const card = await Card.findByPk(id);

  if (!card) {
    throw new AppError('Card não encontrado');
  }

  const list = await List.findOne({
    where: { id: card.listId },
    include: [
      {
        model: Workspace,
        as: 'workspace',
        include: [
          {
            model: User,
            as: 'collaborators',
            attributes: ['id', 'name', 'email'],
            through: { attributes: [] },
          },
        ],
      },
    ],
  });

  if (!list) {
    throw new AppError('Lista do card não encontrada');
  }

  io.to(`workspace_${list.workspaceId}`).emit('delete_card', card);

  await card.destroy();
};
