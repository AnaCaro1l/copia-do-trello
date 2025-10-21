import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Workspace } from '../../models/Workspace';
import { handleBackgroundOperations } from '../../utils/background';
import uploadOnCloudinary, {
  cloudinaryFolderName,
} from '../../utils/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { AddUploadJobService } from '../JobServices/AddUploadJobService';

interface Request {
  name?: string;
  visibility?: boolean;
  backgroundPath?: string;
  backgroundColor?: string;
  id: string;
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

  if (backgroundPath) {
      await AddUploadJobService({
        filePath: backgroundPath,
        workspaceId: workspace.id,
      });
    }

  const updatedWorkspace = await workspace.update({
    name: name ? name : workspace.name,
    visibility: visibility ?? workspace.visibility,
    backgroundColor: backgroundColor
      ? backgroundColor
      : workspace.backgroundColor,
    updatedAt: new Date(),
  });

  io.to(`user_${workspace.collaborators}`).emit(
    'show_updated_workspace',
    updatedWorkspace
  );

  return updatedWorkspace;
};
