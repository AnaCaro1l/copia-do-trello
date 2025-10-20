import { AppError } from "../../errors/AppError";
import { Invite } from "../../models/Invite"

export const ShowInviteService = async (id: string) => {
    const invite = await Invite.findByPk(id);

    if(!invite) {
        throw new AppError("Convite não encontrado")
    }

    return invite;
}