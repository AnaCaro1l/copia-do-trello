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
}

export const CreateWorkspaceService = async ({
  name,
  visibility,
  ownerId,
  backgroundPath,
}: Request): Promise<Workspace> => {
  const owner = await User.findByPk(ownerId);
  await WorkspaceSchemas.createWorkspace.validate({ name, visibility });
  if (!owner) {
    throw new AppError('Usuário não encontrado');
  }

  let background = null;
  if (backgroundPath) {
    background = await uploadOnCloudinary(backgroundPath);
  }

  const workspace = await Workspace.create({
    name,
    visibility,
    ownerId,
    background,
  });
  return workspace;
};
