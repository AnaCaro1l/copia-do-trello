import { object, string } from 'yup';

export class UserSchema {
    static createUser = object({
        name: string().required(),
        email: string().email().required(),
        password: string().required()
    })
}