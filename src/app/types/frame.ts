import { TaskList } from "./tasklist";

export interface Frame {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  coverImageUrl: string | null;
  coverColor: string | null;
  taskLists: TaskList[] | null;  
  members: string[] | null;
  visibility: 'private' | 'public';
  favorite: boolean;
}
