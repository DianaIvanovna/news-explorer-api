// errors/confict.js
class Confict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}
module.exports = Confict;
