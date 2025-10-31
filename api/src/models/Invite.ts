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
import { User } from './User';
import { Workspace } from './Workspace';

@Table
export class Invite extends Model<Invite> {
  @ForeignKey(() => User)
  @Column
  senderId: number;

  @ForeignKey(() => User)
  @Column
  receiverId: number;

  @ForeignKey(() => Workspace)
  @Column
  workspaceId: number;

  @Default('pending')
  @Column
  status: 'pending' | 'accepted' | 'declined';

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  @BelongsTo(() => User, 'receiverId')
  receiver: User;

  @BelongsTo(() => Workspace, 'workspaceId')
  workspace: Workspace;
}
