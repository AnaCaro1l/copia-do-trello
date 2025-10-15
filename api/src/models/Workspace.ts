import {
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User';
import { WorkspaceUser } from './WorkspaceUser';

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

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @BelongsToMany(() => User, () => WorkspaceUser)
  collaborators: User[];

  @HasMany(() => WorkspaceUser)
  workspaceUsers: WorkspaceUser[];
}
