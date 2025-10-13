import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User';
import { Workspace } from './Workspace';

@Table({
  tableName: 'WorkspaceUsers',
  timestamps: true,
})
export class WorkspaceUser extends Model<WorkspaceUser> {
  @ForeignKey(() => Workspace)
  @Column
  workspaceId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Workspace)
  workspace: Workspace;
}
