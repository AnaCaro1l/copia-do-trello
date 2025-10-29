import io from '../../app';
import { AppError } from '../../errors/AppError';
import { Workspace } from '../../models/Workspace';
import { handleBackgroundOperations } from '../../utils/background';
import uploadOnCloudinary, {
  cloudinaryFolderName,
} from '../../utils/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

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

  const normalizedVisibility: boolean | undefined =
    typeof visibility === 'string'
      ? visibility === '1' || visibility === 'true'
      : visibility;
  const normalizedBackgroundColor: string | null | undefined =
    backgroundColor === 'null' || backgroundColor === ''
      ? null
      : backgroundColor;

  const updateData: Partial<Workspace> & { updatedAt: Date } = {
    updatedAt: new Date(),
  } as any;

  if (typeof name !== 'undefined') updateData.name = name as any;
  if (typeof normalizedVisibility !== 'undefined')
    updateData.visibility = normalizedVisibility as any;

  if (backgroundPath) {
    const newBackgroundUrl = await uploadOnCloudinary(backgroundPath);
    updateData.backgroundUrl = newBackgroundUrl as any;
    updateData.backgroundColor = null as any;
  }

  if (typeof normalizedBackgroundColor !== 'undefined') {
    updateData.backgroundColor = normalizedBackgroundColor as any;
    if (normalizedBackgroundColor) {
      updateData.backgroundUrl = null as any;
    }
  }

  const updatedWorkspace = await workspace.update({
    name: updateData.name ?? workspace.name,
    visibility: updateData.visibility ?? workspace.visibility,
    backgroundUrl:
      typeof updateData.backgroundUrl !== 'undefined'
        ? (updateData.backgroundUrl as any)
        : workspace.backgroundUrl,
    backgroundColor:
      typeof updateData.backgroundColor !== 'undefined'
        ? (updateData.backgroundColor as any)
        : workspace.backgroundColor,
    updatedAt: updateData.updatedAt,
  });

  io.to(`user_${workspace.collaborators}`).emit(
    'show_updated_workspace',
    updatedWorkspace
  );

  return updatedWorkspace;
};
