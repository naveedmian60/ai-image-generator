const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      trim: true
    },
    negativePrompt: {
      type: String,
      default: '',
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Model identifier is required'],
      trim: true
    },
    provider: {
      type: String,
      required: [true, 'Provider identifier is required'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    localPath: {
      type: String,
      default: ''
    },
    aspectRatio: {
      type: String,
      default: '1:1'
    },
    quality: {
      type: String,
      default: 'standard'
    },
    width: {
      type: Number,
      default: 1024
    },
    height: {
      type: Number,
      default: 1024
    },
    seed: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    },
    error: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

generationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Generation', generationSchema);
