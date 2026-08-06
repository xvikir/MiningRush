const express = require('express');
const { createScore, getLeaderboard, getStats } = require('../controllers/scoreController');
const validateScore = require('../middleware/validateScore');

const router = express.Router();
router.post('/', validateScore, createScore);
router.get('/leaderboard', getLeaderboard);
router.get('/stats', getStats);

module.exports = router;
