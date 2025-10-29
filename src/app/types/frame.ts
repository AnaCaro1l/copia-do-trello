import { TaskList } from "./tasklist";
import { User } from "./user";

export interface Frame {
  id: number;
  name: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  backgroundUrl?: string | null;
  backgroundColor?: string | null;
  lists?: TaskList[] | null;
  collaborators?: User[] | null;
  visibility: boolean;
  favorite?: boolean | false;
}
