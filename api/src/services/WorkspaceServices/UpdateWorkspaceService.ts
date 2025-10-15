import { AppError } from '../../errors/AppError';
import { Workspace } from '../../models/Workspace';
import uploadOnCloudinary from '../../utils/cloudinary';

interface Request {
  name?: string;
  visibility?: boolean;
  backgroundPath?: string;
  id: number;
}

export const UpdateWorkspaceService = async ({
  name,
  visibility,
  backgroundPath,
  id,
}: Request) => {
  const workspace = await Workspace.findByPk(id);

  if (!workspace) {
    throw new AppError('Área de trabalho não encontrada');
  }

  let background = null;
  if (backgroundPath) {
    background = await uploadOnCloudinary(backgroundPath);
  }

  const updatedWorkspace = await workspace.update({
    name: name ? name : workspace.name,
    visibility: visibility ? visibility : workspace.visibility,
    background: background ? background : workspace.background,
    updatedAt: new Date(),
  });

  return workspace;
};
