import io from "../../app";
import { AppError } from "../../errors/AppError";
import { Invite } from "../../models/Invite";

interface Request {
    senderId: number;
    receiverId: number;
    workspaceId: number;
}

export const CreateInviteService = async({ senderId, receiverId, workspaceId }: Request): Promise<Invite> => {
    
    if (!senderId) {
        throw new AppError("Remetente não encontrado")
    }

    if (!receiverId) {
        throw new AppError("Destinatário não encontrado")
    }

    if (!workspaceId) {
        throw new AppError("Área de trabalho não encontrada")
    }

    const invite = await Invite.create({
        senderId,
        receiverId,
        workspaceId,
        status: 'pending',
    })
    
    io.to(`user_${receiverId}`).emit("show_new_invite", invite);
    return invite
}