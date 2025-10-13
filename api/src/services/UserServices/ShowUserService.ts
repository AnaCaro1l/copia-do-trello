import { AppError } from "../../errors/AppError"
import { User } from "../../models/User"

export const ShowUserService = async (id: string):Promise<User> => {
    const user = await User.findByPk(id)

    if (!user) {
        throw new AppError('Usuário não encontrado')
    }
    
    return user
}