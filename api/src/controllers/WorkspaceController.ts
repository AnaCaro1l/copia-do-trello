import { Request, Response } from "express";
import { CreateWorkspaceService } from "../services/WorkspaceServices/CreateWorkspaceService";
import { ListWorkspacesServices } from "../services/WorkspaceServices/ListWorkspacesService";
import { ShowWorkspaceService } from "../services/WorkspaceServices/ShowWorkspaceService";

const handleBackgroundOperations = async (
  existingBackgroundUrl: string | null
) => {
  if (!existingBackgroundUrl) return null;
  const backgroundParts = existingBackgroundUrl.split('workspace-backgrounds/');
  if (backgroundParts.length > 1) {
    return backgroundParts[1].split('.')[0];
  }
  return null;
};

export const insert = async (req: Request, res: Response): Promise<Response> => {
    const { name, visibility } = req.body;
    const ownerId = req.user.id;
    const backgroundPath = req.file?.path;
    const workspace = await CreateWorkspaceService({ name, visibility, ownerId, backgroundPath });

    return res.status(201).json({
        message: 'Area de trabalho criado com sucesso',
        workspace
    });
};

export const listWorkspaces = async (req: Request, res: Response): Promise<Response> => {
    const ownerId = req.user.id;
    const workspaces = await ListWorkspacesServices(ownerId);
    return res.status(200).json({
        message: 'Áreas de trabalho listadas com sucesso',
        workspaces,
    });
}

export const showWorkspace = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  const workspace = await ShowWorkspaceService(id);

  return res.status(200).json({
    message: 'Área de trabalho encontrada com sucesso',
    workspace
  })
}