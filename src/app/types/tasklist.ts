import { Task } from "./task";

export interface TaskList {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  coverImageUrl: string | null;
  coverColor: string | null;
  archived: boolean;
  isOpen: boolean;
}