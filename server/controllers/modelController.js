const { getAvailableModels } = require('../services/imageGeneration');

// @desc    Get list of supported AI image models and their capabilities
// @route   GET /api/models
// @access  Public
exports.getModels = (req, res) => {
  const models = getAvailableModels();
  res.status(200).json({
    success: true,
    count: models.length,
    models
  });
};

