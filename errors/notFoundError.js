// errors/notFoundError.js
class NotFoundError extends Error { // ресурс не найден
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
module.exports = NotFoundError;
