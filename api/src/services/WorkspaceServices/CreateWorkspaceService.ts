import io from '../../app';
import { AppError } from '../../errors/AppError';
import { User } from '../../models/User';
import { Workspace } from '../../models/Workspace';
import uploadOnCloudinary from '../../utils/cloudinary';
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

  let backgroundUrl = null;
  if (backgroundPath) {
    backgroundUrl = await uploadOnCloudinary(backgroundPath);
  }

  const workspace = await Workspace.create({
    name,
    visibility,
    ownerId,
    backgroundUrl,
    backgroundColor,
  });

  await workspace.$set('collaborators', [ownerId]);

  io.to(`user_${ownerId}`).emit('show_new_workspace', workspace);
  return workspace;
};
