import io from '../../app';
import { AppError } from '../../errors/AppError';
import { List } from '../../models/List';
import { ListSchemas } from './schemas';

interface Request {
  title: string;
  workspaceId: number;
}

export const CreateListService = async ({
  title,
  workspaceId,
}: Request): Promise<List> => {
  await ListSchemas.createList.validate({ title });

  if (!workspaceId) {
    throw new AppError('Área de trabalho não encontrada');
  }

  const list = await List.create({
    title,
    workspaceId,
  });

  if(list.workspace.collaborators.length > 0) {
    io.to(`workspace_${workspaceId}`).emit('show_new_list', list);
  }
  return list;
};
