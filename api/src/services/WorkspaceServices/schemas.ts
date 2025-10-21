import { number, object, string } from 'yup';

export class WorkspaceSchemas {
  static createWorkspace = object({
    name: string().required(),
    visibility: number().optional(),
  });
}
