const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: [true, 'Player name is required.'],
      trim: true,
      maxlength: [20, 'Player name cannot exceed 20 characters.']
    },
    playerClass: {
      type: String,
      required: [true, 'Player class is required.'],
      trim: true,
      maxlength: [15, 'Player class cannot exceed 15 characters.']
    },
    blocksMined: {
      type: Number,
      required: [true, 'Blocks mined is required.'],
      min: [0, 'Blocks mined cannot be negative.'],
      validate: { validator: Number.isInteger, message: 'Blocks mined must be an integer.' }
    },
    wrongAttempts: {
      type: Number,
      required: [true, 'Wrong attempts is required.'],
      min: [0, 'Wrong attempts cannot be negative.'],
      validate: { validator: Number.isInteger, message: 'Wrong attempts must be an integer.' }
    },
    timeTaken: {
      type: Number,
      required: [true, 'Time taken is required.'],
      min: [0, 'Time taken cannot be negative.']
    },
    maxLevel: {
      type: Number,
      required: [true, 'Max level is required.'],
      min: [1, 'Max level must be between 1 and 5.'],
      max: [5, 'Max level must be between 1 and 5.'],
      validate: { validator: Number.isInteger, message: 'Max level must be an integer.' }
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

scoreSchema.index({ blocksMined: -1, wrongAttempts: 1, timeTaken: 1, createdAt: 1 });
scoreSchema.index({ createdAt: -1 });
scoreSchema.index({ blocksMined: -1 });
scoreSchema.index({ playerName: 1 });

module.exports = mongoose.model('Score', scoreSchema);
