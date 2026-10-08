const { imageModels, getModelById, getAvailableModels } = require('./models');
const { getProvider } = require('./provider');

/**
 * High-level image generation function adhering to user specification:
 * generateImage({
 *   model,
 *   prompt,
 *   aspectRatio,
 *   quality,
 *   numberOfImages
 * });
 */
const generateImage = async ({
  model = 'flux-schnell',
  prompt,
  negativePrompt = '',
  aspectRatio = '1:1',
  quality = 'standard',
  numberOfImages = 1,
  seed = null
}) => {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Please enter a descriptive prompt to generate an image.');
  }

  const modelConfig = getModelById(model);
  if (!modelConfig) {
    throw new Error(`The model "${model}" is not recognized.`);
  }

  if (!modelConfig.available) {
    throw new Error(`Model "${modelConfig.name}" is currently unavailable.`);
  }

  // Validate aspect ratio
  const validAspectRatio = modelConfig.supportedAspectRatios.includes(aspectRatio)
    ? aspectRatio
    : modelConfig.defaultAspectRatio || '1:1';

  // Validate quality
  const validQuality = modelConfig.supportsQuality.includes(quality)
    ? quality
    : modelConfig.supportsQuality[0] || 'standard';

  // Negative prompt support check
  const sanitizedNegativePrompt = modelConfig.supportsNegativePrompt
    ? (negativePrompt || '').trim()
    : '';

  // Get provider
  const provider = getProvider(modelConfig.provider);

  // Invoke generation
  const generationResult = await provider.generateImage({
    modelConfig,
    prompt: prompt.trim(),
    negativePrompt: sanitizedNegativePrompt,
    aspectRatio: validAspectRatio,
    quality: validQuality,
    numberOfImages,
    seed
  });

  return {
    ...generationResult,
    model: modelConfig.id,
    modelName: modelConfig.name,
    aspectRatio: validAspectRatio,
    quality: validQuality,
    prompt: prompt.trim(),
    negativePrompt: sanitizedNegativePrompt
  };
};

const getModelsForClient = () => {
  const openAiKeyConfigured = Boolean(
    process.env.AI_API_KEY || process.env.OPENAI_API_KEY
  );

  return imageModels.map((m) => {
    // If it's an OpenAI model and no API key configured, mark requiresKey: true
    const requiresKey = m.provider === 'openai' && !openAiKeyConfigured;
    return {
      ...m,
      requiresKey
    };
  });
};

module.exports = {
  generateImage,
  getAvailableModels: getModelsForClient,
  getModelById
};

