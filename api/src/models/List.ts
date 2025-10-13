import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Workspace } from './Workspace';
import { Card } from './Card';

@Table
export class List extends Model<List> {
  @Column
  title: string;

  @Column
  cardIds: string;

  @ForeignKey(() => Workspace)
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
