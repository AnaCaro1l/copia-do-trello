import io from '../../app';
import { AppError } from '../../errors/AppError';
import { List } from '../../models/List';
import { Workspace } from '../../models/Workspace';

interface ListData {
  title?: string;
  orderIndex?: number;
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

  const { title, orderIndex } = listData;

  if (orderIndex !== undefined) {
    const oldListOrder = await List.findOne({
      where: { orderIndex: orderIndex, workspaceId: list.workspaceId },
    });

    await oldListOrder?.update({
      orderIndex: list.orderIndex,
    });

    await list.update({
      orderIndex: orderIndex,
    });
  }

  const updatedList = await list.update({
    ...listData,
  });

  io.to(`workspace_${list.workspaceId}`).emit('show_updated_list', updatedList);

  return updatedList;
};
