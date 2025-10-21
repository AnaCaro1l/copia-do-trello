import { Request, Response } from 'express';
import { ShowInviteService } from '../services/InviteServices/ShowInviteService';
import { ListInvitesService } from '../services/InviteServices/ListInvitesService';
import { ValidateInviteService } from '../services/InviteServices/ValidateInviteService';

export const showInvite = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id;

  const invite = await ShowInviteService(id);

  return res.status(200).json({
    message: 'Convite encontrado com sucesso',
    invite,
  });
};

export const listInvites = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.user.id;

  const invites = await ListInvitesService(id);

  return res.status(200).json({
    message: 'Convites listados com sucesso',
    invites,
  });
};

export const validateInvite = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { status, inviteId } = req.body;

  const invite = await ValidateInviteService({ status, inviteId });

  return res.status(200).json({
    message: 'Convite atualizado com sucesso',
    invite,
  });
};
