import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data' });
    }

    const matches = imageBase64.match(/^data:(.+);base64,(.*)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const fileName = `cake-${Date.now()}.png`;

    // 🔑 Pass the token here
    const { url } = await put(fileName, buffer, {
      access: 'public',
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ success: true, imageUrl: url });
  } catch (err) {
    console.error('Upload error:', err);
    return res
      .status(500)
      .json({ error: 'Upload failed', details: err.message });
  }
}
