import { uploadQueue } from "../../queues/uploadQueue";

interface uploadJobData {
    filePath: string;
    workspaceId: number;
}

export const AddUploadJobService = async ({ filePath, workspaceId }: uploadJobData) => {
    await uploadQueue.add(
        'upload_background_image',
        { filePath, workspaceId },
        {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: true,
            removeOnFail: false,
        }
    );

    console.log(`Job adicionado: upload para workspace ${workspaceId}`)
}
