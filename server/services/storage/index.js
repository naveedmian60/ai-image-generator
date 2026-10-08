const { getStorageProvider } = require('./provider');

/**
 * Save image buffer using the configured storage provider
 * @param {Object} options
 * @param {Buffer} options.buffer
 * @param {string} options.mimeType
 * @param {string} [options.originalName]
 * @returns {Promise<{ url: string, localPath?: string, provider: string }>}
 */
const saveImage = async ({ buffer, mimeType, originalName }) => {
  const provider = getStorageProvider();
  return await provider.upload({ buffer, mimeType, originalName });
};

/**
 * Delete image from storage
 * @param {string} imageUrl
 * @returns {Promise<boolean>}
 */
const deleteImage = async (imageUrl) => {
  const provider = getStorageProvider();
  return await provider.delete(imageUrl);
};

module.exports = {
  saveImage,
  deleteImage
};

