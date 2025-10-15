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

  return list;
};
