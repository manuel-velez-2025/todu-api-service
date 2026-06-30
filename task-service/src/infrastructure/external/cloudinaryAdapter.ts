import { v2 as cloudinary } from 'cloudinary';
import { IStorageProvider } from '../../application/IStorageProvider';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryAdapter implements IStorageProvider {
  async upload(file: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Error al subir imagen a Cloudinary'));
            return;
          }
          resolve(result.secure_url);
        }
      );
      uploadStream.end(file);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
