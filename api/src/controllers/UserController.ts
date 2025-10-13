import { Request, Response } from "express";
import { CreateUserService } from "../services/UserServices/CreateUserService";
import { ShowUserService } from "../services/UserServices/ShowUserService";

export const addUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const user = await CreateUserService({name, email, password})
    return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
    });
} 

export const showUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await ShowUserService(id);
    return res.status(200).json({
        user
    })
}