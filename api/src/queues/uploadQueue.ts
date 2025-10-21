import { Queue } from 'bullmq';
import { redisConnection } from '../utils/redis';

export const uploadQueue = new Queue('upload_queue', {
    connection: redisConnection,
})