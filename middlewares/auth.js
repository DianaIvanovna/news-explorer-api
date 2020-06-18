// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config.js');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  let payload;
  console.log(req.cookies.jwt);
  const token = req.cookies.jwt; // верифицируем токен
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    const error = new UnauthorizedError('Необходима авторизация');
    next(error);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return null;
};
