class UnauthorizedError extends Error { // когда что-то не так при аутентификации или авторизации;
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
module.exports = UnauthorizedError;
