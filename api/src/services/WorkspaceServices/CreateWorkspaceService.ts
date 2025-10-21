import io from '../../app';
import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import { Workspace } from '../../models/Workspace';
import uploadOnCloudinary from '../../utils/cloudinary';
import { AddUploadJobService } from '../JobServices/AddUploadJobService';
import { WorkspaceSchemas } from './schemas';

interface Request {
  name: string;
  visibility?: boolean;
  ownerId: number;
  backgroundPath?: string;
  backgroundColor?: string;
}

export const CreateWorkspaceService = async ({
  name,
  visibility,
  ownerId,
  backgroundPath,
  backgroundColor,
}: Request): Promise<Workspace> => {
  const owner = await User.findByPk(ownerId);
  await WorkspaceSchemas.createWorkspace.validate({ name, visibility });
  if (!owner) {
    throw new AppError('Usuário não encontrado');
  }

  const workspace = await Workspace.create({
    name,
    visibility,
    ownerId,
    backgroundUrl: null,
    backgroundColor,
  });

  await workspace.$set('collaborators', [ownerId]);

  if (backgroundPath) {
    await AddUploadJobService({
      filePath: backgroundPath,
      workspaceId: workspace.id,
    });
  }

  io.to(`user_${ownerId}`).emit('show_new_workspace', workspace);
  return workspace;
};
