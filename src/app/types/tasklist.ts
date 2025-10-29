import { Task } from "./task";

export interface TaskList {
  id: number;
  workspaceId: number;
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  cards: Task[];
  // UI-only state (not from backend)
  isOpen?: boolean;
}