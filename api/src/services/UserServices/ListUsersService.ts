import { User } from '../../models/User';

export const ListUsersService = async (): Promise<User[]> => {
  const users = await User.findAll();
  return users;
};
