export interface Task {
  id: number;
  listId: number;
  position?: number;
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  completed: boolean;
  dueDate: string | Date | null;
  description: string | null;
  color: string | null;
  media: string | null;
}
