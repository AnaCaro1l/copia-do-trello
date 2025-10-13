import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Workspace } from './Workspace';
import { Card } from './Card';

@Table
export class List extends Model<List> {
  @Column
  title: string;

  @Column
  cardIds: string;

  @Column
  workspaceId: number;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @BelongsTo(() => Workspace, 'workspaceId')
  workspace: Workspace;

  @HasMany(() => Card)
  cards: Card[];
}
