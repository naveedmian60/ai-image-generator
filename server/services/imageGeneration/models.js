/**
 * Centralized Model Catalog for AI Image Generation
 * Each model maps to an actual provider and specifies its supported capabilities.
 */

const imageModels = [
  {
    id: 'flux-schnell',
    name: 'Flux.1 Schnell',
    tagline: 'Ultra-fast & Photorealistic',
    description: 'Next-generation 12B parameter model delivering pristine realism, vibrant colors, and sub-3-second rendering.',
    provider: 'pollinations',
    providerModel: 'flux',
    badge: 'Popular',
    speed: 'Very Fast (~2s)',
    qualityTier: 'High',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
    supportsNegativePrompt: false,
    supportsQuality: ['standard', 'high'],
    maxImages: 1,
    defaultAspectRatio: '1:1',
    available: true
  },
  {
    id: 'flux-dev',
    name: 'Flux.1 Dev',
    tagline: 'Deep Nuance & Aesthetic Precision',
    description: 'High-fidelity model capable of intricate lighting, complex scenes, textural details, and cinematic atmosphere.',
    provider: 'pollinations',
    providerModel: 'flux-realism',
    badge: 'Ultra Quality',
    speed: 'Standard (~5s)',
    qualityTier: 'Ultra HD',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
    supportsNegativePrompt: false,
    supportsQuality: ['standard', 'high'],
    maxImages: 1,
    defaultAspectRatio: '1:1',
    available: true
  },
  {
    id: 'turbo',
    name: 'SDXL Turbo',
    tagline: 'Sub-Second Diffusion',
    description: 'Adversarial diffusion distillation engineered for real-time iterative rendering and rapid concept brainstorming.',
    provider: 'pollinations',
    providerModel: 'turbo',
    badge: 'Lightning Fast',
    speed: 'Instant (~1s)',
    qualityTier: 'Standard',
    supportedAspectRatios: ['1:1', '16:9', '9:16'],
    supportsNegativePrompt: true,
    supportsQuality: ['standard'],
    maxImages: 1,
    defaultAspectRatio: '1:1',
    available: true
  },
  {
    id: 'anime',
    name: 'Anime & Manga Style',
    tagline: 'Vibrant Stylized Art',
    description: 'Fine-tuned weights specialized for anime portraits, cel-shading, fantasy key visuals, and illustrative artwork.',
    provider: 'pollinations',
    providerModel: 'flux-anime',
    badge: 'Stylized',
    speed: 'Fast (~3s)',
    qualityTier: 'High',
    supportedAspectRatios: ['1:1', '16:9', '9:16', '3:4'],
    supportsNegativePrompt: true,
    supportsQuality: ['standard', 'high'],
    maxImages: 1,
    defaultAspectRatio: '1:1',
    available: true
  },
  {
    id: 'dall-e-3',
    name: 'OpenAI DALL-E 3',
    tagline: 'Contextual Prompt Adherence',
    description: 'OpenAI flagship model with exceptional comprehension of natural language prompts, text rendering, and spatial detail.',
    provider: 'openai',
    providerModel: 'dall-e-3',
    badge: 'OpenAI',
    speed: 'Standard (~8s)',
    qualityTier: 'HD',
    supportedAspectRatios: ['1:1', '16:9', '9:16'],
    supportsNegativePrompt: false,
    supportsQuality: ['standard', 'hd'],
    maxImages: 1,
    defaultAspectRatio: '1:1',
    available: true
  },
  {
    id: 'dall-e-2',
    name: 'OpenAI DALL-E 2',
    tagline: 'Classic Multi-Output',
    description: 'Reliable and established image model supporting multiple image generations per request.',
    provider: 'openai',
    providerModel: 'dall-e-2',
    badge: 'OpenAI Legacy',
    speed: 'Fast (~4s)',
    qualityTier: 'Standard',
    supportedAspectRatios: ['1:1'],
    supportsNegativePrompt: false,
    supportsQuality: ['standard'],
    maxImages: 4,
    defaultAspectRatio: '1:1',
    available: true
  }
];

const getModelById = (id) => {
  return imageModels.find((m) => m.id === id);
};

const getAvailableModels = () => {
  return imageModels.filter((m) => m.available);
};

module.exports = {
  imageModels,
  getModelById,
  getAvailableModels
};

