import { Task } from "./task";

export interface TaskList {
  id: number;
  workspaceId: number;
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  cards: Task[];
  isOpen?: boolean;
  orderIndex?: number;
}