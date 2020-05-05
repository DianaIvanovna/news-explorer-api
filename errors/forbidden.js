// errors/forbidde.js
class Forbidden extends Error { // когда с запросом что-то не так;
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
module.exports = Forbidden;
