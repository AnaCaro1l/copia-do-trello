import { Worker } from 'bullmq';
import uploadOnCloudinary from '../utils/cloudinary';
import { AppError } from '../errors/AppError';
import { Workspace } from '../models/Workspace';
import { redisConnection } from '../utils/redis';
import dotenv from 'dotenv';
import { sequelize } from '../database';

dotenv.config();

export const uploadWorker = new Worker(
  'upload_queue',
  async (job) => {
    const { filePath, workspaceId } = job.data;
    console.log(
      `Processando upload de ${filePath} para workspace ${workspaceId}`
    );
    await sequelize.authenticate();

    const url = await uploadOnCloudinary(filePath);

    if (!url) {
      throw new AppError('Falha ao fazer upload');
    }

    const workspace = await Workspace.findByPk(workspaceId);

    if (workspace) {
      await workspace.update({ backgroundUrl: url });
    } else {
      throw new AppError('Workspace não encontrada');
    }
  },
  { connection: redisConnection }
);

uploadWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

uploadWorker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err.message}`);
});