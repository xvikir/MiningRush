const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required.'],
      trim: true,
      maxlength: [500, 'Question text cannot exceed 500 characters.']
    },
    answer: {
      type: Number,
      required: [true, 'Question answer is required.']
    },
    level: {
      type: Number,
      required: [true, 'Question level is required.'],
      min: [1, 'Level must be between 1 and 5.'],
      max: [5, 'Level must be between 1 and 5.']
    },
    topic: {
      type: String,
      required: [true, 'Question topic is required.'],
      trim: true,
      maxlength: [100, 'Topic cannot exceed 100 characters.']
    },
    difficulty: {
      type: String,
      required: [true, 'Question difficulty is required.'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy, medium, or hard.'
      }
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

questionSchema.index({ level: 1 });
questionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
