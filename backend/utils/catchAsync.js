// Wraps an async controller function so any rejected promise/thrown error
// is forwarded to Express's error-handling middleware via next(err),
// instead of needing a try/catch in every controller.
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
