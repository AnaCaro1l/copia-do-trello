import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import { Workspace } from '../../models/Workspace';

interface Request {
  userId: number;
  workspaceId: number;
  userIds: number[];
}

export const RemoveCollaboratorsService = async ({
  userId,
  workspaceId,
  userIds,
}: Request): Promise<void> => {
  const workspace = await Workspace.findByPk(workspaceId);

  if (!workspace) {
    throw new AppError('Área de trabalho não encontrada');
  }

  const users = await User.findAll({
    where: { id: userIds },
  });

  if (users.length === 0) {
    throw new AppError('Nenhum usuário válido encontrado');
  }

  if(userIds.includes(workspace.ownerId)) {
    throw new AppError('O proprietário da área de trabalho não pode ser removido como colaborador');
  }

  if (workspace.ownerId !== userId) {
    throw new AppError(
      'Apenas o proprietário da área de trabalho pode remover colaboradores'
    );
  }

  await workspace.$remove('collaborators', users);
};
