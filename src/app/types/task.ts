export interface Task {
  id: number;
  listId: number;
  position?: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  tags: string[] | null;
  dueDate: Date | null;
  description: string | null;
  comments: string[];
  coverImageUrl: string | null;
  color: string | null;
}
