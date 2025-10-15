import { AppError } from '../../errors/AppError';
import { Workspace } from '../../models/Workspace';
import uploadOnCloudinary from '../../utils/cloudinary';

interface Request {
  name?: string;
  visibility?: boolean;
  backgroundPath?: string;
  backgroundColor?: string;
  id: number;
}

export const UpdateWorkspaceService = async ({
  name,
  visibility,
  backgroundPath,
  backgroundColor,
  id,
}: Request) => {
  const workspace = await Workspace.findByPk(id);

  if (!workspace) {
    throw new AppError('Área de trabalho não encontrada');
  }

  let backgroundUrl = null;
  if (backgroundPath) {
    backgroundUrl = await uploadOnCloudinary(backgroundPath);
  }

  const updatedWorkspace = await workspace.update({
    name: name ? name : workspace.name,
    visibility: visibility ? visibility : workspace.visibility,
    backgroundUrl: backgroundUrl ? backgroundUrl : workspace.backgroundUrl,
    backgroundColor: backgroundColor ? backgroundColor : workspace.backgroundColor,
    updatedAt: new Date(),
  });

  return updatedWorkspace;
};
