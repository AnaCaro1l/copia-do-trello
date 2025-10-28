import { TaskList } from "./tasklist";

export interface Frame {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  backgroundUrl?: string | null;
  backgroundColor?: string | null;
  lists?: TaskList[] | null;
  collaborators?: string[] | null;
  visibility: 0 | 1 | false | true;
  favorite?: boolean | false;
}
