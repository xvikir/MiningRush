require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');
const connectDatabase = require('../config/db');
const Question = require('../models/Question');

const inputPath = path.resolve(process.argv[2] || path.join(__dirname, '../data/questions.json'));

async function importQuestions() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not configured. Copy .env.example to .env and set it first.');
    }

    const rawData = await fs.readFile(inputPath, 'utf8');
    const questions = JSON.parse(rawData);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('The question file must contain a non-empty JSON array.');
    }

    await connectDatabase();
    await Promise.all(questions.map((question) => new Question(question).validate()));
    await Question.deleteMany({});
    const imported = await Question.insertMany(questions, { ordered: true });
    console.log(`Imported ${imported.length} question(s) from ${inputPath}.`);
  } catch (error) {
    console.error(`Question import failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

importQuestions();
