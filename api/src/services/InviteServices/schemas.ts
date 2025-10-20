import { number, object } from "yup";

export class InviteSchemas {
    static createInvite = object({
        senderId: number().required(),
        receiverId: number().required(),
        workspaceId: number().required(),
    })
}