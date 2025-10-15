import { object, string } from "yup";

export class ListSchemas {
    static createList = object({
        title: string().required(),
    })
}