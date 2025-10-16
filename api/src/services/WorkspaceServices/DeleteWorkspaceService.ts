import { AppError } from '../../errors/AppError';
import { Workspace } from '../../models/Workspace';
import { handleBackgroundOperations } from '../../utils/background';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryFolderName } from '../../utils/cloudinary';
import { WorkspaceUser } from '../../models/WorkspaceUser';
import io from '../../app';
import { List } from '../../models/List';

export const DeleteWorkspaceService = async (id: string): Promise<void> => {
  const workspace = await Workspace.findByPk(id);

  if (!workspace) {
    throw new AppError('Área de trabalho não encontrada');
  }

  const lists = await List.findAll({
    where: { workspaceId: id },
  });

  for (const list of lists) {
    await list.destroy();
  }

  if (workspace.backgroundUrl) {
    const background = await handleBackgroundOperations(
      workspace.backgroundUrl
    );
    if (background) {
      await cloudinary.uploader
        .destroy(`${cloudinaryFolderName}/${background}`, { invalidate: true })
        .then((result) => console.log(result));
    }
  }

  const collaborators = await WorkspaceUser.findAll({
    where: { workspaceId: workspace.id },
  });

  await workspace.$remove(
    'collaborators',
    collaborators.map((w) => w.workspaceId)
  );

  io.to(`user_${workspace.ownerId}`).emit('delete_workspace', workspace.id);

  await workspace.destroy();
};
