const crypto = require('crypto');
const AppError = require('../utils/AppError');

function passwordsMatch(providedPassword, configuredPassword) {
  const provided = Buffer.from(providedPassword);
  const configured = Buffer.from(configuredPassword);
  return provided.length === configured.length && crypto.timingSafeEqual(provided, configured);
}

function requireAdmin(req, res, next) { // eslint-disable-line no-unused-vars
  const password = req.get('x-admin-password');
  if (!process.env.ADMIN_PASSWORD || typeof password !== 'string' || !passwordsMatch(password, process.env.ADMIN_PASSWORD)) {
    return next(new AppError('Incorrect admin password.', 401));
  }
  next();
}

module.exports = requireAdmin;
