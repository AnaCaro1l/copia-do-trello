import {
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { List } from './List';

@Table
export class Card extends Model<Card> {
  @Column
  title: string;

  @Column
  description: string;

  @ForeignKey(() => List)
  @Column
  listId: number;

  @Default(false)
  @Column
  completed: boolean;

  @Column
  dueDate: Date;

  @Column
  color: string;

  @Column
  position: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => List, 'listId')
  list: List;
}
