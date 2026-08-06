const express = require('express');
const { getRandomQuestion, checkQuestionAnswer } = require('../controllers/questionController');

const router = express.Router();
router.get('/random', getRandomQuestion);
router.post('/check', checkQuestionAnswer);

module.exports = router;
