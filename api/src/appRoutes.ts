import { Router } from 'express';
import userRoutes from './routes/userRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import listRoutes from './routes/listRoutes';
import cardRoutes from './routes/cardRoutes';

const routes = Router();

routes.use('/', userRoutes);
routes.use('/', workspaceRoutes);
routes.use('/', listRoutes);
routes.use('/', cardRoutes);

export default routes;