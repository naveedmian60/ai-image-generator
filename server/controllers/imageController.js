const Generation = require('../models/Generation');
const { generateImage } = require('../services/imageGeneration');
const { saveImage, deleteImage } = require('../services/storage');

// @desc    Generate a new AI image
// @route   POST /api/images/generate
// @access  Private
exports.createGeneration = async (req, res, next) => {
  try {
    const {
      prompt,
      negativePrompt,
      model = 'flux-schnell',
      aspectRatio = '1:1',
      quality = 'standard',
      numberOfImages = 1,
      seed
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A descriptive prompt is required to generate an image.'
      });
    }

    // Call AI provider service layer
    const generated = await generateImage({
      model,
      prompt: prompt.trim(),
      negativePrompt: negativePrompt ? negativePrompt.trim() : '',
      aspectRatio,
      quality,
      numberOfImages,
      seed: seed ? parseInt(seed, 10) : null
    });

    // Save image to permanent storage provider (local disk uploads or Cloudinary)
    const stored = await saveImage({
      buffer: generated.buffer,
      mimeType: generated.mimeType,
      originalName: `pixelforge-${generated.model}`
    });

    // Create record in MongoDB
    const record = await Generation.create({
      user: req.user._id,
      prompt: generated.prompt,
      negativePrompt: generated.negativePrompt,
      model: generated.model,
      provider: generated.provider,
      imageUrl: stored.url,
      localPath: stored.localPath || '',
      aspectRatio: generated.aspectRatio,
      quality: generated.quality,
      width: generated.width,
      height: generated.height,
      seed: generated.seed,
      status: 'completed'
    });

    res.status(201).json({
      success: true,
      message: 'Image generated successfully!',
      generation: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all generations for current user
// @route   GET /api/images
// @access  Private
exports.getUserGenerations = async (req, res, next) => {
  try {
    const { page = 1, limit = 24, model, q } = req.query;

    const query = { user: req.user._id };

    if (model && model !== 'all') {
      query.model = model;
    }

    if (q && q.trim()) {
      query.prompt = { $regex: q.trim(), $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    const total = await Generation.countDocuments(query);
    const generations = await Generation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: generations.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      generations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single generation by ID
// @route   GET /api/images/:id
// @access  Private
exports.getGenerationById = async (req, res, next) => {
  try {
    const generation = await Generation.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!generation) {
      return res.status(404).json({
        success: false,
        message: 'Generation not found or you do not have permission to view it.'
      });
    }

    res.status(200).json({
      success: true,
      generation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a generation and remove stored image
// @route   DELETE /api/images/:id
// @access  Private
exports.deleteGeneration = async (req, res, next) => {
  try {
    const generation = await Generation.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!generation) {
      return res.status(404).json({
        success: false,
        message: 'Generation not found or already deleted.'
      });
    }

    // Delete image file from storage if local
    if (generation.imageUrl) {
      await deleteImage(generation.imageUrl);
    }

    // Delete database record
    await generation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Generation deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

