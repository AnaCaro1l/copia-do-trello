import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Workspace } from './Workspace';
import { WorkspaceUser } from './WorkspaceUser';
import { Invite } from './Invite';

@Table({
  tableName: 'Users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column
  name: string;

  @Column(DataType.STRING(100))
  email: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @Column
  passwordHash: string;

  @HasMany(() => Workspace)
  workspaces: Workspace[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => Workspace, () => WorkspaceUser)
  collaborations: Workspace[];

  @HasMany(() => WorkspaceUser)
  workspaceUsers: WorkspaceUser[];

  @HasMany(() => Invite, 'senderId')
  sentInvites: Invite[];

  @HasMany(() => Invite, 'receiverId')
  receivedInvites: Invite[];
}
