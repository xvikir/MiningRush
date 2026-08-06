const allowedNodeEnvironments = ['development', 'test', 'production'];

function parseOrigins(value) {
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

function validateEnvironment() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = Number(process.env.PORT || 5000);

  if (!allowedNodeEnvironments.includes(nodeEnv)) {
    throw new Error(`NODE_ENV must be one of: ${allowedNodeEnvironments.join(', ')}.`);
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required.');
  }
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is required.');
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  const configuredOrigins = process.env.CORS_ORIGIN ? parseOrigins(process.env.CORS_ORIGIN) : [];
  if (nodeEnv === 'production' && !configuredOrigins.length) {
    throw new Error('CORS_ORIGIN is required in production.');
  }
  if (nodeEnv === 'production' && configuredOrigins.includes('null')) {
    throw new Error('CORS_ORIGIN cannot include null in production.');
  }

  return {
    nodeEnv,
    port,
    corsOrigins: configuredOrigins.length
      ? configuredOrigins
      : ['http://localhost:5500', 'http://127.0.0.1:5500', 'null']
  };
}

module.exports = validateEnvironment;
