import { object, string } from "yup";

export class CardSchemas {
    static createCard = object({
        title: string().required(),
        description: string().optional(),
        media: string().optional(),
    })
}