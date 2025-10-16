import { TaskList } from "./tasklist";

export interface Frame {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  coverImageUrl?: string | null;
  coverColor?: string | null;
  taskLists?: TaskList[] | null;
  members?: string[] | null;
  visibility: 0 | 1;
  favorite?: boolean | false;
}
