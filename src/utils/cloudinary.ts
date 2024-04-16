import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import sharp from 'sharp';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadToCloudinary = async (image_path: string) => {
    const compressedImagePath = image_path + '.compressed.jpg';
    await sharp(image_path).jpeg({ quality: 80 }).toFile(compressedImagePath);

    const uploaded = await cloudinary.v2.uploader.upload(compressedImagePath, {
        folder: 'Sialo',
    });

    return uploaded.secure_url;
};
