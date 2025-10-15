export interface Task {
  id: number;
  tasklistId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  tags: string[] | null;
  dueDate: Date | null;
  description: string | null;
  members: string[] | null;
  comments: string[];
  coverImageUrl: string | null;
  coverColor: string | null;
}
