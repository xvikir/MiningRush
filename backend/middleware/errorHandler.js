function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  const isInvalidJson = error instanceof SyntaxError && error.status === 400 && 'body' in error;
  const statusCode = error.statusCode || (error.name === 'ValidationError' || isInvalidJson ? 400 : 500);
  const message = isInvalidJson
    ? 'Request body must contain valid JSON.'
    : error.name === 'ValidationError'
    ? Object.values(error.errors).map((item) => item.message).join(' ')
    : error.message || 'Internal server error.';

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
}

module.exports = { notFoundHandler, errorHandler };
