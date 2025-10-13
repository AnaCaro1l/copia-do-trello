import { Request, Response } from "express";
import { CreateUserService } from "../services/UserServices/CreateUserService";

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await CreateUserService({name, email, password})
    return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
    });
} 