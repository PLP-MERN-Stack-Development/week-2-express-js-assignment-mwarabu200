// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    error: {
      name: err.name,
      message: message,
      status: status,
    }
  });
}

module.exports = errorHandler;
