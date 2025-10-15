import { Workspace } from "../../models/Workspace";

export const ListWorkspacesServices = async (userId: number): Promise<Workspace[]> => {
    const workspaces = await Workspace.findAll({
        where: { ownerId: userId }
    });
    return workspaces;
}