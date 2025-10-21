import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
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

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  @BelongsTo(() => User, 'receiverId')
  receiver: User;

  @BelongsTo(() => Workspace, 'workspaceId')
  workspace: Workspace;
}
