import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { List } from './List';

@Table
export class Card extends Model<Card> {
  @Column
  title: string;

  @Column
  description: string;

  @Column
  media: string;

  @ForeignKey(() => List)
  @Column
  listId: number;

  @Default(false)
  @Column
  completed: boolean;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @BelongsTo(() => List, 'listId')
  list: List;
}
