import { Workspace } from '../../models/Workspace';

export const ShowWorkspaceService = async (id: string): Promise<Workspace> => {
  const workspace = await Workspace.findByPk(id);
  if (!workspace) {
    throw new Error('Workspace not found');
  }
  return workspace;
};
