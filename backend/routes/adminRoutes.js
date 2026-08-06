const express = require('express');
const { resetScores } = require('../controllers/adminController');
const { getAnalytics } = require('../controllers/analyticsController');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();
router.post('/reset', resetScores);
router.get('/analytics', requireAdmin, getAnalytics);

module.exports = router;
