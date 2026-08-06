const Score = require('../models/Score');
const asyncHandler = require('../utils/asyncHandler');

exports.getAnalytics = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [summaryResult, gamesPlayedToday, topPlayers, lastGames] = await Promise.all([
    Score.aggregate([
      {
        $group: {
          _id: null,
          totalGamesPlayed: { $sum: 1 },
          totalBlocksMined: { $sum: '$blocksMined' },
          averageBlocksMined: { $avg: '$blocksMined' },
          averageCompletionTime: { $avg: '$timeTaken' },
          averageWrongAttempts: { $avg: '$wrongAttempts' },
          highestScore: { $max: '$blocksMined' },
          highestLevelReached: { $max: '$maxLevel' },
          players: { $addToSet: { playerName: '$playerName', playerClass: '$playerClass' } }
        }
      },
      {
        $project: {
          _id: 0,
          totalPlayers: { $size: '$players' },
          totalGamesPlayed: 1,
          totalBlocksMined: 1,
          averageBlocksMined: { $round: ['$averageBlocksMined', 2] },
          averageCompletionTime: { $round: ['$averageCompletionTime', 2] },
          averageWrongAttempts: { $round: ['$averageWrongAttempts', 2] },
          highestScore: 1,
          highestLevelReached: 1
        }
      }
    ]),
    Score.countDocuments({ createdAt: { $gte: startOfToday } }),
    Score.aggregate([
      {
        $group: {
          _id: { playerName: '$playerName', playerClass: '$playerClass' },
          gamesPlayed: { $sum: 1 },
          totalBlocksMined: { $sum: '$blocksMined' },
          highestScore: { $max: '$blocksMined' },
          averageWrongAttempts: { $avg: '$wrongAttempts' },
          averageCompletionTime: { $avg: '$timeTaken' }
        }
      },
      {
        $project: {
          _id: 0,
          playerName: '$_id.playerName',
          playerClass: '$_id.playerClass',
          gamesPlayed: 1,
          totalBlocksMined: 1,
          highestScore: 1,
          averageWrongAttempts: { $round: ['$averageWrongAttempts', 2] },
          averageCompletionTime: { $round: ['$averageCompletionTime', 2] }
        }
      },
      { $sort: { highestScore: -1, totalBlocksMined: -1, averageWrongAttempts: 1, averageCompletionTime: 1 } },
      { $limit: 10 }
    ]),
    Score.find().sort({ createdAt: -1 }).limit(20).lean()
  ]);

  const summary = summaryResult[0] || {
    totalPlayers: 0,
    totalGamesPlayed: 0,
    totalBlocksMined: 0,
    averageBlocksMined: 0,
    averageCompletionTime: 0,
    averageWrongAttempts: 0,
    highestScore: 0,
    highestLevelReached: 0
  };

  res.json({
    success: true,
    data: {
      ...summary,
      gamesPlayedToday,
      topPlayers,
      lastGames
    }
  });
});
