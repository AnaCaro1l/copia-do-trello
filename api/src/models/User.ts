import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Workspace } from './Workspace';
import { WorkspaceUser } from './WorkspaceUser';

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

  @BelongsToMany(() => Workspace, () => WorkspaceUser)
  collaborations: Workspace[];
}
