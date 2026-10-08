const axios = require('axios');

/**
 * Base Abstract Image Provider
 */
class BaseImageProvider {
  constructor(name) {
    this.name = name;
  }

  async generateImage(params) {
    throw new Error(`generateImage() is not implemented for provider "${this.name}"`);
  }

  resolveDimensions(aspectRatio) {
    switch (aspectRatio) {
      case '16:9':
        return { width: 1280, height: 720 };
      case '9:16':
        return { width: 720, height: 1280 };
      case '4:3':
        return { width: 1024, height: 768 };
      case '3:4':
        return { width: 768, height: 1024 };
      case '1:1':
      default:
        return { width: 1024, height: 1024 };
    }
  }
}

/**
 * Hugging Face Provider - Free and reliable image generation with Auto-Retry
 */
class HuggingFaceProvider extends BaseImageProvider {
  constructor() {
    super('huggingface');
    this.apiKey = process.env.HUGGINGFACE_API_KEY || process.env.AI_API_KEY;
  }

  // Yeh function API ko call karne ki koshish karega aur fail hone par dobara try karega
  async fetchWithRetry(url, payload, maxRetries = 3) {
    let lastError = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await axios.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          responseType: 'arraybuffer',
          timeout: 120000 // Timeout barha diya 2 minute tak
        });

        return response; // Agar response theek hai toh wapas result bhej do

      } catch (err) {
        lastError = err;
        // 503 ka matlab model load ho raha hai, ya timeout ho gaya hai
        if (err.response && (err.response.status === 503 || err.response.status === 429)) {
          console.warn(`[HuggingFace] Model loading or busy, retrying in 5 seconds... (Attempt ${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second wait karega
        } else {
          // Agar koi aur error hai (jaise API key galat hai), toh foran break kar do
          break;
        }
      }
    }
    throw lastError; // Agar 3 dafa fail ho gaya toh error throw kar do
  }

  async generateImage({ modelConfig, prompt, negativePrompt, aspectRatio, quality, seed }) {
    if (!this.apiKey) {
      throw new Error('Hugging Face API Key is missing. Please set HUGGINGFACE_API_KEY in server/.env');
    }

    const { width, height } = this.resolveDimensions(aspectRatio);
    // Default to SDXL model
    const providerModel = modelConfig?.providerModel || 'stabilityai/stable-diffusion-xl-base-1.0';
    const url = `https://api-inference.huggingface.co/models/${providerModel}`;

    const payload = {
      inputs: prompt,
      parameters: {
        negative_prompt: negativePrompt || undefined,
        width: width,
        height: height
      },
      options: { wait_for_model: true } // Waits if model is loading
    };

    try {
      // Yahan Retry wala function call hoga
      const response = await this.fetchWithRetry(url, payload);

      const buffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'] || 'image/jpeg';

      return {
        buffer,
        mimeType: contentType,
        width,
        height,
        seed: seed || Math.floor(Math.random() * 2147483647),
        provider: 'huggingface',
        actualModel: providerModel
      };
    } catch (err) {
      let errMsg = err.message;
      if (err.response && err.response.data) {
        try {
          const errorJson = JSON.parse(Buffer.from(err.response.data).toString('utf8'));
          errMsg = errorJson.error || errMsg;
        } catch(e) {}
      }
      console.error('[HuggingFace Error]:', errMsg);
      throw new Error(`Hugging Face generation error: ${errMsg}`);
    }
  }
}

/**
 * Pollinations Provider - Generates genuine AI images via Flux, SDXL Turbo, Anime models.
 */
class PollinationsProvider extends BaseImageProvider {
  constructor() {
    super('pollinations');
    this.baseUrl = 'https://image.pollinations.ai/prompt';
  }

  async generateImage({ modelConfig, prompt, negativePrompt, aspectRatio, quality, seed }) {
    const { width, height } = this.resolveDimensions(aspectRatio);
    const resolvedSeed = seed || Math.floor(Math.random() * 2147483647);
    const providerModel = modelConfig?.providerModel || 'flux';

    let finalPrompt = prompt.trim();
    if (negativePrompt && negativePrompt.trim()) {
      finalPrompt += ` [avoid: ${negativePrompt.trim()}]`;
    }

    const encodedPrompt = encodeURIComponent(finalPrompt);
    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      model: providerModel
    });

    const apiKey = process.env.AI_API_KEY || process.env.POLLINATIONS_API_KEY;
    if (apiKey && apiKey.trim()) {
      params.append('key', apiKey.trim());
      params.append('nologo', 'true');
      if (resolvedSeed) params.append('seed', resolvedSeed.toString());
      if (quality === 'high') params.append('enhance', 'true');
    }

    const candidateModels = [providerModel];
    if (providerModel !== 'sana') candidateModels.push('sana');
    if (providerModel !== 'turbo') candidateModels.push('turbo');
    if (providerModel !== 'flux') candidateModels.push('flux');

    let lastError = null;

    for (const activeModel of candidateModels) {
      params.set('model', activeModel);
      const targetUrl = `${this.baseUrl}/${encodedPrompt}?${params.toString()}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(targetUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return {
          buffer,
          mimeType: contentType,
          width,
          height,
          seed: resolvedSeed,
          directUrl: targetUrl,
          provider: 'pollinations',
          actualModel: activeModel
        };
      } catch (err) {
        lastError = err;
        console.warn(`[Pollinations] Model ${activeModel} failed (${err.message}), trying fallback...`);
      }
    }

    // ==========================================
    // FALLBACK TO HUGGING FACE AUTOMATICALLY
    // ==========================================
    console.warn('[Pollinations] All models failed. Falling back to Hugging Face provider...');
    const hfProvider = new HuggingFaceProvider();
    return await hfProvider.generateImage({ modelConfig, prompt, negativePrompt, aspectRatio, quality, seed });
  }
}

/**
 * OpenAI Provider - Supports DALL-E 3 and DALL-E 2
 */
class OpenAIProvider extends BaseImageProvider {
  constructor() {
    super('openai');
    this.apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  }

  async generateImage({ modelConfig, prompt, aspectRatio, quality, numberOfImages }) {
    const apiKey = this.apiKey || process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OpenAI API Key is not configured. Please set AI_API_KEY or OPENAI_API_KEY in server/.env, or select a Flux/Turbo/Anime model.'
      );
    }

    const providerModel = modelConfig?.providerModel || 'dall-e-3';

    let size = '1024x1024';
    if (providerModel === 'dall-e-3') {
      if (aspectRatio === '16:9') size = '1792x1024';
      else if (aspectRatio === '9:16') size = '1024x1792';
      else size = '1024x1024';
    }

    const openAiQuality = quality === 'hd' || quality === 'high' ? 'hd' : 'standard';
    const n = providerModel === 'dall-e-3' ? 1 : Math.min(numberOfImages || 1, 4);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: providerModel,
          prompt,
          n,
          size,
          quality: providerModel === 'dall-e-3' ? openAiQuality : undefined,
          response_format: 'b64_json'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          timeout: 75000
        }
      );

      const item = response.data.data[0];
      const buffer = Buffer.from(item.b64_json, 'base64');
      const [w, h] = size.split('x').map(Number);

      return {
        buffer,
        mimeType: 'image/png',
        width: w || 1024,
        height: h || 1024,
        revisedPrompt: item.revised_prompt || prompt,
        provider: 'openai'
      };
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || err.message;
      console.error('[OpenAI Error]:', errMsg);
      throw new Error(`OpenAI generation error: ${errMsg}`);
    }
  }
}

/**
 * Provider Registry
 */
const providers = {
  pollinations: new PollinationsProvider(),
  openai: new OpenAIProvider(),
  huggingface: new HuggingFaceProvider() // Registered HF Provider
};

const getProvider = (providerName) => {
  const provider = providers[providerName?.toLowerCase()];
  if (!provider) {
    throw new Error(`AI Provider "${providerName}" is not registered or supported.`);
  }
  return provider;
};

module.exports = {
  BaseImageProvider,
  PollinationsProvider,
  HuggingFaceProvider,
  OpenAIProvider,
  getProvider
};