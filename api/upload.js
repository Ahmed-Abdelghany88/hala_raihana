import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'whatsapp_uploads',
    });

    return res.status(200).json({
      success: true,
      imageUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);

    // Send full error info to frontend for debugging
    return res.status(500).json({
      error: 'Upload failed',
      details: error.message || error,
    });
  }
}
