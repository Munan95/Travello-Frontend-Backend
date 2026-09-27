const jwt = require('jsonwebtoken');

module.exports = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
