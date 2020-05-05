// errors/badRequestError.js
class BadRequestError extends Error { // когда с запросом что-то не так;
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
module.exports = BadRequestError;
