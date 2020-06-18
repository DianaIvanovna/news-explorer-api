// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config.js');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  let payload;
  const token = req.cookies.jwt; // верифицируем токен
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    const error = new UnauthorizedError(`${req.cookies.jwt}`);
    next(error);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return null;
};
