import { Task } from "./task";

export interface TaskList {
  id: number;
  workspaceId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  coverImageUrl: string | null;
  coverColor: string | null;
  archived: boolean;
  isOpen: boolean;
}