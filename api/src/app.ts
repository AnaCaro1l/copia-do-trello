import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { sequelize } from './database';
import { ValidationError } from 'yup';
import { AppError } from './errors/AppError';
import routes from './appRoutes';
import { MulterError } from 'multer';
import { Server } from 'socket.io';

const app = express();
const port = 3333;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:4200'
]

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}
app.use(
  cors((corsOptions))
);

app.use(express.json());
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.message,
      status: 'validation error',
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      status: err.statusCode,
    });
  }

  if (err instanceof MulterError) {
    return res.status(400).json({
      message: err.message,
      status: 'Multer error',
    });
  }

  console.log(err);
  return res.status(500).json({
    message: 'Internal server error',
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

io.on('connection', (socket) => {
  console.log('Um usuário conectou');

  socket.on('join_workspace', (workspaceId: number) => {
    const room = `workspace_${workspaceId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} entrou na sala ${room}`);
  });

  socket.on('leave_workspace', (workspaceId: number) => {
    const room = `workspace_${workspaceId}`;
    socket.leave(room);
    console.log(`Socket ${socket.id} saiu da sala ${room}`);
  });

  socket.on('join_user', (userId: number) => {
    const room = `user_${userId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} entrou na sala ${room}`);
  });

  socket.on('leave_user', (userId: number) => {
    const room = `user_${userId}`;
    socket.leave(room);
    console.log(`Socket ${socket.id} saiu da sala ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Um usuário desconectado');
  });
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function syncDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.log(err);
  }
}

syncDb();
export default io;
