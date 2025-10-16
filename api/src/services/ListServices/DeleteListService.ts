import { AppError } from "../../errors/AppError";
import { Card } from "../../models/Card";
import { List } from "../../models/List"

export const DeleteListService = async (id: string): Promise<void> => {
    const list = await List.findByPk(id);

    if (!list) {
        throw new AppError('Lista não encontrada');
    }

    const cards = await Card.findAll({
        where: {
            listId: id
        }
    })

    for (const card of cards) {
        await card.destroy();
    }

    await list.destroy();
}