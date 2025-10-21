import io from '../../app';
import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import { Workspace } from '../../models/Workspace';
import { CreateInviteService } from '../InviteServices/CreateInviteService';

interface Request {
  userId: number;
  workspaceId: number;
  emails: string[];
}

export const AddCollaboratorsService = async ({
  userId,
  workspaceId,
  emails,
}: Request): Promise<void> => {
  const userIds: number[] = [];
  const workspace = await Workspace.findByPk(workspaceId);
  if (!workspace) {
    throw new AppError('Área de trabalho não encontrada');
  }

  if (workspace.visibility === false) {
    throw new AppError(
      'Não é possível adicionar colaboradores a uma área de trabalho privada'
    );
  }
  for (const email of emails) {
    const user = await User.findOne({ where: { email } });
    if (user) {
      userIds.push(user.id);
    }
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
};
