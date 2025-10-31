import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Workspace } from '../../models/Workspace';
import { handleBackgroundOperations } from '../../utils/background';
import uploadOnCloudinary, {
  cloudinaryFolderName,
} from '../../utils/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

interface WorkspaceData {
  name?: string;
  visibility?: boolean;
  backgroundColor?: string;
}

interface Request {
  id: string;
  backgroundPath?: string;
  workspaceData: WorkspaceData;
}

export const UpdateWorkspaceService = async ({
  id,
  backgroundPath,
  workspaceData,
}: Request) => {
  const workspace = await Workspace.findByPk(id);

  if (!workspace) {
    throw new AppError('Área de trabalho não encontrada');
  }

  let {
    name,
    visibility,
    backgroundColor,
  } = workspaceData;

  let backgroundUrl = null

  if (backgroundPath) {
    backgroundUrl = await uploadOnCloudinary(backgroundPath);
    backgroundColor = null;
  }

  if (workspace.backgroundUrl && backgroundPath) {
    const oldBackground = await handleBackgroundOperations(
      workspace.backgroundUrl
    );
    if (oldBackground) {
      await cloudinary.uploader
        .destroy(`${cloudinaryFolderName}/${oldBackground}`, {
          invalidate: true,
        })
        .then((result) => console.log(result));
    }
  }

  if (backgroundColor) {
    backgroundUrl = null;
    await cloudinary.uploader
      .destroy(`${cloudinaryFolderName}/${workspace.backgroundUrl}`, {
        invalidate: true,
      })
      .then((result) => console.log(result));
  }

  const updatedWorkspace = await workspace.update({
    ...workspaceData as any,
    backgroundUrl: backgroundUrl ?? workspace.backgroundUrl,
  });

  io.to(`user_${workspace.collaborators}`).emit(
    'show_updated_workspace',
    updatedWorkspace
  );

  return updatedWorkspace;
};
