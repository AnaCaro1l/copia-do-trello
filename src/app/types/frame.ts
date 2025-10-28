import { TaskList } from "./tasklist";
import { User } from "./user";

export interface Frame {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  backgroundUrl?: string | null;
  backgroundColor?: string | null;
  lists?: TaskList[] | null;
  collaborators?: User[] | null;
  visibility: 0 | 1 | false | true;
  favorite?: boolean | false;
}
