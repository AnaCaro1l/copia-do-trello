import { Workspace } from '../../models/Workspace';

export const ShowWorkspaceService = async (id: string): Promise<Workspace> => {
  const workspace = await Workspace.findOne({
    where: { id: id },
    include: ['lists', 'collaborators'],
  });
  if (!workspace) {
    throw new Error('Área de trabalho não encontrada');
  }
  return workspace;
};
