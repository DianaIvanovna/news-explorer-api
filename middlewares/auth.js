// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config.js');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  let payload;
  // const token = req.cookies.jwt; // верифицируем токен
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI1MmNlMjRiYjRlYjE2YTA1NWRmZGIiLCJpYXQiOjE1ODg5MzE4MjF9.EI6EybVR6ScpCCrkgdHHiPiZ1yUvkZ8vGDii72e_bCk';

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
