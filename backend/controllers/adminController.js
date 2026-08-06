const Score = require('../models/Score');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.resetScores = asyncHandler(async (req, res) => {
  const { password } = req.body || {};

  if (!process.env.ADMIN_PASSWORD) {
    throw new AppError('Admin reset is not configured.', 503);
  }
  if (typeof password !== 'string' || password !== process.env.ADMIN_PASSWORD) {
    throw new AppError('Incorrect admin password.', 401);
  }

  const result = await Score.deleteMany({});
  res.json({
    success: true,
    message: 'Leaderboard reset successfully.',
    deletedCount: result.deletedCount
  });
});
