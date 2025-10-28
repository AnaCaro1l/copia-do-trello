import io from '../../app';
import { AppError } from '../../errors/AppError';
import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';

interface Request {
  id: string;
  title?: string;
}

export const UpdateListService = async ({
  id,
  title,
}: Request): Promise<List> => {
  const list = await List.findOne({
    where: { id: id },
    include: [
      {
        model: Workspace,
        as: 'workspace',
      },
    ],
  });

  if (!list) {
    throw new AppError('Lista não encontrada');
  }

  const updatedList = await list.update({
    title: title ? title : list.title,
    updatedAt: new Date(),
  });

  io.to(`workspace_${list.workspaceId}`).emit('show_updated_list', updatedList);

  return updatedList;
};
