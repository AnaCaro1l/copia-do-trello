export interface Invite {
  id: number;
  date: Date;
  sender: {
    id: number;
    name: string;
  };
  workspace: {
    id: number;
    name: string;
  };
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}
