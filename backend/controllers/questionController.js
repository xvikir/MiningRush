const Question = require('../models/Question');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getRandomQuestion = asyncHandler(async (req, res) => {
  const level = Number(req.query.level);
  if (!Number.isInteger(level) || level < 1 || level > 5) {
    throw new AppError('Query parameter level must be an integer between 1 and 5.', 400);
  }

  const excludedIds = String(req.query.exclude || '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .slice(0, 250)
    .map((id) => new mongoose.Types.ObjectId(id));

  const selectRandomQuestion = async (match) => {
    const [question] = await Question.aggregate([
      { $match: match },
      { $sample: { size: 1 } },
      { $project: { _id: 0, id: { $toString: '$_id' }, question: 1, level: 1 } }
    ]);
    return question;
  };

  let question = await selectRandomQuestion(
    excludedIds.length ? { level, _id: { $nin: excludedIds } } : { level }
  );

  // Once a player has exhausted a level's pool, start a fresh random pool.
  if (!question && excludedIds.length) {
    question = await selectRandomQuestion({ level });
  }

  if (!question) {
    throw new AppError(`No questions are available for level ${level}.`, 404);
  }

  res.json({ success: true, data: question });
});

exports.checkQuestionAnswer = asyncHandler(async (req, res) => {
  const { questionId, answer } = req.body || {};

  if (typeof questionId !== 'string' || !questionId.trim()) {
    throw new AppError('questionId is required.', 400);
  }
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    throw new AppError('questionId is invalid.', 400);
  }
  if (typeof answer !== 'number' || !Number.isFinite(answer)) {
    throw new AppError('answer must be a finite number.', 400);
  }

  const question = await Question.findById(questionId).select('answer').lean();
  if (!question) {
    throw new AppError('Question not found.', 404);
  }

  res.json({ success: true, correct: question.answer === answer });
});
