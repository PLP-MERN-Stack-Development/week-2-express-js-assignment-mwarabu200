class NotFoundError extends Error {
  constructor(message) {
    super(message);              // Set the error message
    this.name = 'NotFoundError'; // Give the error a custom name
    this.statusCode = 404;       // Assign an HTTP status code
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

module.exports = {
  NotFoundError,
  ValidationError
};
