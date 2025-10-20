import io from '../../app';
import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import { Workspace } from '../../models/Workspace';
import { CreateInviteService } from '../InviteServices/CreateInviteService';

interface Request {
  userId: number;
  workspaceId: number;
  userIds: number[];
}

export const AddCollaboratorsService = async ({
  userId,
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

  for (const user of users) {
    const invite = await CreateInviteService({
      senderId: userId,
      receiverId: user.id,
      workspaceId: workspace.id,
    });

    io.to(`user_${user.id}`).emit('new_invite', invite);
  }

  await workspace.$add('collaborators', users);
};
