import { Router } from 'express';
import userRoutes from './routes/userRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import listRoutes from './routes/listRoutes';
import cardRoutes from './routes/cardRoutes';
import inviteRoutes from './routes/inviteRoutes';

const routes = Router();

routes.use('/', userRoutes);
routes.use('/', workspaceRoutes);
routes.use('/', listRoutes);
routes.use('/', cardRoutes);
routes.use('/', inviteRoutes);

export default routes;
