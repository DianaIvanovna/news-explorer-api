// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config.js');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  let payload;
  // удали потом
  req.cookies = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWFmMTRkZGQzZTRlOTI3ZDg5MzIzNTIiLCJpYXQiOjE1ODg1MzM2OTh9.P8EI40yQZCiUvjKXAGiL-D81oz9R4u7gr-lmhS7TXWI';

  const token = req.cookies.jwt; // верифицируем токен
  //const token = req.cookies; // удали потом
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
