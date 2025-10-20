import { Request, Response } from "express";
import { ShowInviteService } from "../services/InviteServices/ShowInviteService";
import { ListInvitesService } from "../services/InviteServices/ListInvitesService";

export const showInvite = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;

    const invite = await ShowInviteService(id);

    return res.status(200).json({
        message: 'Convite encontrado com sucesso',
        invite,
    })
}

export const listInvites = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;

    const invites = await ListInvitesService(id);

    return res.status(200).json({
        message: 'Convites listados com sucesso',
        invites,
    })
}