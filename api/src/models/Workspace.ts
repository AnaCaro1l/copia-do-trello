import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User';
import { WorkspaceUser } from './WorkspaceUser';
import { List } from './List';
import { Invite } from './Invite';

@Table({
  tableName: 'Workspaces',
  timestamps: true,
})
export class Workspace extends Model<Workspace> {
  @Column
  name: string;

  @Column
  backgroundUrl: string;

  @Column
  backgroundColor: string;

  @Default(false)
  @Column
  visibility: boolean;

  @ForeignKey(() => User)
  @Column
  ownerId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @BelongsToMany(() => User, () => WorkspaceUser)
  collaborators: User[];

  @HasMany(() => WorkspaceUser)
  workspaceUsers: WorkspaceUser[];

  @HasMany(() => List)
  lists: List[];

  @HasMany(() => Invite)
  invites: Invite[];
}
