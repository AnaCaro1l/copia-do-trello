import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import { Workspace } from '../../models/Workspace';

interface Request {
  workspaceId: number;
  userIds: number[];
}

export const AddCollaboratorsService = async ({
  workspaceId,
  userIds,
}: Request): Promise<void> => {
  const workspace = await Workspace.findByPk(workspaceId);
  if (!workspace) {
    throw new AppError('Área de trabalho não encontrada');
  }

  if (workspace.visibility === false) {
    throw new AppError(
      'Não é possível adicionar colaboradores a uma área de trabalho privada'
    );
  }

  const users = await User.findAll({
    where: { id: userIds },
  });

  if (users.length === 0) {
    throw new AppError('Nenhum usuário válido encontrado');
  }

  await workspace.$add('collaborators', users);
};
