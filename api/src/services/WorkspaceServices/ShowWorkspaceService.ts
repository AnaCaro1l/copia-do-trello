import { IncludeOptions, Op } from 'sequelize';
import { Workspace } from '../../models/Workspace';
import { List } from '../../models/List';
import { WorkspaceUser } from '../../models/WorkspaceUser';
import { AppError } from '../../errors/AppError';

interface Request {
  id: string;
  userId: number;
}

export const ShowWorkspaceService = async ({
  id,
  userId,
}: Request): Promise<Workspace> => {
  let includeOptions: IncludeOptions[] = [];
  const workspace = await Workspace.findOne({
    where: { id: id },
    include: ['collaborators', ...includeOptions],
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

  const lists = await List.findAll({
    where: { workspaceId: workspace.id },
  });

  if (lists.length > 0) {
    includeOptions.push({ model: List, as: 'lists', include: ['cards'] });
  }

  return workspace;
};
