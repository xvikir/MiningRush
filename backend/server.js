require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { rateLimit } = require('express-rate-limit');
const mongoose = require('mongoose');
const validateEnvironment = require('./config/env');
const connectDatabase = require('./config/db');
const questionRoutes = require('./routes/questionRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const { nodeEnv, port, corsOrigins } = validateEnvironment();
const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS.');
    error.statusCode = 403;
    return callback(error);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-Admin-Password'],
  optionsSuccessStatus: 204
};

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many reset attempts. Please try again later.' }
});

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(cors(corsOptions));
app.use(express.json({ limit: '20kb' }));
app.use('/api', apiRateLimit);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Mining Rush API is healthy.' });
});
app.use('/api/questions', questionRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRateLimit, adminRoutes);
app.use('/api', scoreRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

let server;

async function shutdown(signal) {
  console.log(`${signal} received. Closing server...`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.connection.close(false);
  console.log('MongoDB connection closed.');
  process.exit(0);
}

connectDatabase()
  .then(() => {
    server = app.listen(port, () => console.log(`Mining Rush API listening on port ${port}.`));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
    process.once('SIGINT', () => shutdown('SIGINT'));
  })
  .catch((error) => {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  });
