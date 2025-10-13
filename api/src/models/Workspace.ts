import {
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
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
  background: string;

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
}
