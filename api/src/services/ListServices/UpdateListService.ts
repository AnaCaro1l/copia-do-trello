import io from '../../app';
import { AppError } from '../../errors/AppError';
import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';

interface ListData {
  title?: string;
}

interface Request {
  id: string;
  listData: ListData;
}

export const UpdateListService = async ({
  id,
  listData,
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

  const {
    title,
  } = listData;

  const updatedList = await list.update({
    ...listData,
  });

  io.to(`workspace_${list.workspaceId}`).emit('show_updated_list', updatedList);

  return updatedList;
};
