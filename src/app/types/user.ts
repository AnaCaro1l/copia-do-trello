import { Frame } from './frame';
import { Invite } from './invite';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  workspaces?: Frame[];
  collaborations?: Frame[];
  sentInvites?: Invite[];
  receivedInvites?: Invite[];
}
