const AppError = require('../utils/AppError');

// Translates a few common Mongoose errors into friendly AppErrors.
const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`An account/record with that ${field} already exists.`, 400);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input: ${messages.join('. ')}`, 400);
};

module.exports = (err, req, res, next) => {
  let error = err;
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (error.name === 'CastError') error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateFieldsError(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || 'Something went wrong',
  });
};
