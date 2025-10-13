import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { List } from './List';

@Table
export class Card extends Model<Card> {
  @Column
  title: string;

  @Column
  description: string;

  @Column
  media: string;

  @Column
  listId: number;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @BelongsTo(() => List, 'listId')
  list: List;
}
