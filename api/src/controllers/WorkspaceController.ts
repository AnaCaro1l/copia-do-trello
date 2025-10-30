import { Request, Response } from 'express';
import { CreateWorkspaceService } from '../services/WorkspaceServices/CreateWorkspaceService';
import { ListWorkspacesServices } from '../services/WorkspaceServices/ListWorkspacesService';
import { ShowWorkspaceService } from '../services/WorkspaceServices/ShowWorkspaceService';
import { UpdateWorkspaceService } from '../services/WorkspaceServices/UpdateWorkspaceService';
import { DeleteWorkspaceService } from '../services/WorkspaceServices/DeleteWorkspaceService';
import { AddCollaboratorsService } from '../services/WorkspaceServices/AddCollaboratorsService';
import { RemoveCollaboratorsService } from '../services/WorkspaceServices/RemoveCollaboratorsService';

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
  const userId = req.user.id;
  const workspace = await ShowWorkspaceService({ id, userId });

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
  const backgroundPath = req.file?.path;
  const workspaceData = req.body;
  
  const workspace = await UpdateWorkspaceService({
    workspaceData,
    backgroundPath,
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
  const userId = req.user.id;
  await DeleteWorkspaceService({ id, userId });
  return res.status(204).json({
    message: 'Área de trabalho deletada com sucesso',
  });
};

export const addCollaborators = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { workspaceId, emails } = req.body;
  const userId = req.user.id;
  await AddCollaboratorsService({ userId, workspaceId, emails });
  return res.status(200).json({
    message: 'Convites enviados com sucesso',
  });
};

export const removeCollaborators = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { workspaceId, userIds } = req.body;
  const userId = req.user.id;
  await RemoveCollaboratorsService({ userId, workspaceId, userIds });
  return res.status(204).json({
    message: 'Colaboradores removidos com sucesso',
  });
};
