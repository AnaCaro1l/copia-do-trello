import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Workspace } from './Workspace';
import { Card } from './Card';

@Table
export class List extends Model<List> {
  @Column
  title: string;

  @ForeignKey(() => Workspace)
  @Column
  workspaceId: number;

  @Column
  orderIndex: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Workspace, 'workspaceId')
  workspace: Workspace;

  @HasMany(() => Card)
  cards: Card[];
}
