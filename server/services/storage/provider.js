const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Base Abstract Storage Provider
 */
class BaseStorageProvider {
  constructor(name) {
    this.name = name;
  }

  async upload({ buffer, mimeType, originalName }) {
    throw new Error(`upload() is not implemented on ${this.name}`);
  }

  async delete(url) {
    throw new Error(`delete() is not implemented on ${this.name}`);
  }
}

/**
 * Local Disk Storage Provider
 * Permanently persists generated images to local static uploads directory.
 */
class LocalStorageProvider extends BaseStorageProvider {
  constructor() {
    super('local');
    this.uploadDir = path.join(__dirname, '../../public/uploads');
    this.ensureUploadDir();
  }

  ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  getExtension(mimeType) {
    switch (mimeType) {
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      case 'image/jpeg':
      case 'image/jpg':
      default:
        return '.jpg';
    }
  }

  async upload({ buffer, mimeType = 'image/jpeg', originalName }) {
    this.ensureUploadDir();
    const ext = this.getExtension(mimeType);
    const dateStr = new Date().toISOString().slice(0, 10);
    const uniqueId = uuidv4().slice(0, 8);
    const filename = `pixelforge-${dateStr}-${uniqueId}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filePath, buffer);

    // Return the relative URL served by Express static middleware
    const publicUrl = `/uploads/${filename}`;

    return {
      url: publicUrl,
      localPath: filePath,
      filename,
      provider: 'local'
    };
  }

  async delete(imageUrl) {
    if (!imageUrl) return;

    try {
      // Extract filename from URL like /uploads/pixelforge-xxx.png
      const filename = path.basename(imageUrl);
      const filePath = path.join(this.uploadDir, filename);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
    } catch (err) {
      console.warn(`[LocalStorage] Failed to delete file for ${imageUrl}:`, err.message);
    }
    return false;
  }
}

/**
 * Cloudinary Storage Provider
 */
class CloudinaryStorageProvider extends BaseStorageProvider {
  constructor() {
    super('cloudinary');
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    this.apiKey = process.env.CLOUDINARY_API_KEY;
    this.apiSecret = process.env.CLOUDINARY_API_SECRET;
  }

  async upload({ buffer, mimeType }) {
    // If not configured, fall back to local storage
    if (!this.cloudName || !this.apiKey) {
      console.warn('[Storage] Cloudinary not configured, falling back to Local Storage');
      const local = new LocalStorageProvider();
      return await local.upload({ buffer, mimeType });
    }

    // Direct HTTP upload or SDK upload
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    const axios = require('axios');
    const timestamp = Math.round(new Date().getTime() / 1000);
    const crypto = require('crypto');
    const signature = crypto
      .createHash('sha1')
      .update(`timestamp=${timestamp}${this.apiSecret}`)
      .digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', dataUri);
    formData.append('api_key', this.apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', 'pixelforge_generations');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData
    );

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      provider: 'cloudinary'
    };
  }

  async delete(imageUrl) {
    // Implement delete via Cloudinary API if publicId is stored
    return true;
  }
}

/**
 * Storage Provider Factory
 */
const getStorageProvider = () => {
  const providerName = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

  switch (providerName) {
    case 'cloudinary':
      return new CloudinaryStorageProvider();
    case 'local':
    default:
      return new LocalStorageProvider();
  }
};

module.exports = {
  BaseStorageProvider,
  LocalStorageProvider,
  CloudinaryStorageProvider,
  getStorageProvider
};

