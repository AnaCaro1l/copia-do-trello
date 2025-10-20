import { AppError } from "../../errors/AppError";
import { Invite } from "../../models/Invite"

export const ListInvitesService = async (id: string) => {
    const invites = await Invite.findAll({
        where: {
            receiverId: id
        }
    })

    return invites;
}