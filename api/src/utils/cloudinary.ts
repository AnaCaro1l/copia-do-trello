import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { AppError } from '../errors/AppError';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinaryFolderName = 'workspace-backgrounds';

const uploadOnCloudinary = async (file: string): Promise<string | null> => {
  try {
    if (!file) {
      throw new AppError('Arquivo não encontrado');
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: cloudinaryFolderName,
      resource_type: 'image',
    });

    console.log('File uploaded to Cloudinary:', result.url);

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log('Local file deleted:', file);
    } else {
      console.warn('Local file not found, cannot delete:', file);
    }

    return result.url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

export default uploadOnCloudinary;
