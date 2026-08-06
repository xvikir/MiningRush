const Score = require('../models/Score');
const asyncHandler = require('../utils/asyncHandler');

exports.createScore = asyncHandler(async (req, res) => {
  const score = await Score.create(req.body);
  res.status(201).json({ success: true, data: score });
});

exports.getLeaderboard = asyncHandler(async (req, res) => {
  const requestedLimit = Number(req.query.limit || 10);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 10;
  const scores = await Score.find()
    .sort({ blocksMined: -1, wrongAttempts: 1, timeTaken: 1, createdAt: 1 })
    .limit(limit)
    .lean();

  res.json({
    success: true,
    data: scores.map((score, index) => ({ rank: index + 1, ...score }))
  });
});

exports.getStats = asyncHandler(async (req, res) => {
  const [[statistics], distributionRows] = await Promise.all([Score.aggregate([
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        totalBlocksMined: { $sum: '$blocksMined' },
        averageBlocksMined: { $avg: '$blocksMined' },
        bestScore: { $max: '$blocksMined' },
        uniquePlayers: { $addToSet: { name: '$playerName', playerClass: '$playerClass' } }
      }
    },
    {
      $project: {
        _id: 0,
        totalGames: 1,
        totalBlocksMined: 1,
        averageBlocksMined: { $round: ['$averageBlocksMined', 2] },
        bestScore: 1,
        uniquePlayers: { $size: '$uniquePlayers' }
      }
    }
  ]), Score.aggregate([
    { $group: { _id: '$blocksMined', count: { $sum: 1 } } }
  ])]);

  const blockDistribution = distributionRows.reduce((result, row) => {
    result[row._id] = row.count;
    return result;
  }, {});

  res.json({
    success: true,
    data: {
      totalGames: statistics?.totalGames || 0,
      uniquePlayers: statistics?.uniquePlayers || 0,
      totalBlocksMined: statistics?.totalBlocksMined || 0,
      averageBlocksMined: statistics?.averageBlocksMined || 0,
      bestScore: statistics?.bestScore || 0,
      blockDistribution
    }
  });
});
