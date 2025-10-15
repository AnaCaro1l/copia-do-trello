import { Request, Response } from 'express';
import { CreateWorkspaceService } from '../services/WorkspaceServices/CreateWorkspaceService';
import { ListWorkspacesServices } from '../services/WorkspaceServices/ListWorkspacesService';
import { ShowWorkspaceService } from '../services/WorkspaceServices/ShowWorkspaceService';
import { UpdateWorkspaceService } from '../services/WorkspaceServices/UpdateWorkspaceService';
import { DeleteWorkspaceService } from '../services/WorkspaceServices/DeleteWorkspaceService';

export const insert = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, visibility, backgroundColor } = req.body;
  const ownerId = req.user.id;
  const backgroundPath = req.file?.path;
  const workspace = await CreateWorkspaceService({
    name,
    visibility,
    ownerId,
    backgroundPath,
    backgroundColor,
  });

  return res.status(201).json({
    message: 'Area de trabalho criado com sucesso',
    workspace,
  });
};

export const listWorkspaces = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ownerId = req.user.id;
  const workspaces = await ListWorkspacesServices(ownerId);
  return res.status(200).json({
    message: 'Áreas de trabalho listadas com sucesso',
    workspaces,
  });
};

export const showWorkspace = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const workspace = await ShowWorkspaceService(id);

  return res.status(200).json({
    message: 'Área de trabalho encontrada com sucesso',
    workspace,
  });
};

export const updateWorkspace = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  const { name, visibility, backgroundColor } = req.body;
  const backgroundPath = req.file?.path;

  const workspace = await UpdateWorkspaceService({
    name,
    visibility,
    backgroundPath,
    backgroundColor,
    id,
  });

  return res.status(200).json({
    message: 'Área de trabalho atualizada com sucesso',
    workspace,
  });
};

export const deleteWorkspace = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;
  await DeleteWorkspaceService(id);
  return res.status(204).json({
    message: 'Área de trabalho deletada com sucesso',
  });
};
