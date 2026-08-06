const AppError = require('../utils/AppError');

const requiredFields = ['playerName', 'playerClass', 'blocksMined', 'wrongAttempts', 'timeTaken', 'maxLevel'];
const MAX_BLOCKS_MINED = 15;
const GAME_DURATION_SECONDS = 120;

function validateScore(req, res, next) { // eslint-disable-line no-unused-vars
  const body = req.body || {};
  const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');

  if (missingFields.length) {
    return next(new AppError(`Missing required fields: ${missingFields.join(', ')}.`, 400));
  }

  if (typeof body.playerName !== 'string' || typeof body.playerClass !== 'string') {
    return next(new AppError('playerName and playerClass must be strings.', 400));
  }

  if (!body.playerName.trim() || !body.playerClass.trim()) {
    return next(new AppError('playerName and playerClass cannot be empty.', 400));
  }

  const numericFields = ['blocksMined', 'wrongAttempts', 'timeTaken', 'maxLevel'];
  if (numericFields.some((field) => typeof body[field] !== 'number' || !Number.isFinite(body[field]))) {
    return next(new AppError('blocksMined, wrongAttempts, timeTaken, and maxLevel must be finite numbers.', 400));
  }

  if (!Number.isInteger(body.blocksMined) || body.blocksMined < 0 || body.blocksMined > MAX_BLOCKS_MINED) {
    return next(new AppError(`blocksMined must be an integer between 0 and ${MAX_BLOCKS_MINED}.`, 400));
  }
  if (!Number.isInteger(body.wrongAttempts) || body.wrongAttempts < 0) {
    return next(new AppError('wrongAttempts must be a non-negative integer.', 400));
  }
  if (body.timeTaken < 0 || body.timeTaken > GAME_DURATION_SECONDS) {
    return next(new AppError(`timeTaken must be between 0 and ${GAME_DURATION_SECONDS} seconds.`, 400));
  }
  if (!Number.isInteger(body.maxLevel) || body.maxLevel < 1 || body.maxLevel > 5) {
    return next(new AppError('maxLevel must be an integer between 1 and 5.', 400));
  }

  next();
}

module.exports = validateScore;
