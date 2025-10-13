import {
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
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

  @Column
  ownerId: number;

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @BelongsToMany(() => User, () => WorkspaceUser)
  collaborators: User[];
}
