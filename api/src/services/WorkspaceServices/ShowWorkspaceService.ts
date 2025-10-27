import { Op } from 'sequelize';
import { Workspace } from '../../models/Workspace';
import { List } from '../../models/List';
import { WorkspaceUser } from '../../models/WorkspaceUser';
import { Card } from '../../models/Card';
import { AppError } from '../../errors/AppError';

interface Request {
  id: string;
  userId: number;
}

export const ShowWorkspaceService = async ({
  id,
  userId,
}: Request): Promise<Workspace> => {
  const workspace = await Workspace.findOne({
    where: { id: id },
    include: [
      'collaborators',
      { model: List, as: 'lists', include: ['cards'] },
    ],
    order: [
      [{ model: List, as: 'lists' }, 'createdAt', 'ASC'],
      [{ model: List, as: 'lists' }, { model: Card, as: 'cards' }, 'position', 'ASC'],
      [{ model: List, as: 'lists' }, { model: Card, as: 'cards' }, 'createdAt', 'ASC'],
    ],
  });

  if (!workspace) {
    throw new AppError('Área de trabalho não encontrada');
  }

  const validate = await WorkspaceUser.findOne({
    where: {
      [Op.and]: [{ workspaceId: workspace.id }, { userId: userId }],
    },
  });

  if (!validate) {
    throw new AppError(
      'Você não tem permissão para acessar esta área de trabalho'
    );
  }

  return workspace;
};
