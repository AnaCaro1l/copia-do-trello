import { Workspace } from "../../models/Workspace";

interface Request {
    name: string;
    visibility?: boolean;
    ownerId: number;
}

export const CreateWorkspaceService = async ({
  name,
  visibility,
  ownerId,
}: Request): Promise<Workspace> => {
  const workspace = await Workspace.create({
    name,
    visibility,
    ownerId,
  });
  return workspace;
};