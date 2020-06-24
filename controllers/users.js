// controllers/users.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');
const Confict = require('../errors/conflict ');
const { SECRET } = require('../config.js');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.message.startsWith('E11000')) {
        next(new Confict('email занят'));
      }
      next(new BadRequestError(err.message));
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET);
      res
        .cookie('jwt', token, {
          domain: 'news-explorer-api',
          maxAge: 604800,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch((err) => {
      const error = new UnauthorizedError(err.message);
      next(error);
    });
};

module.exports.logout = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, SECRET);
    res
      .cookie('jwt', token, {
        domain: 'news-explorer-api',
        maxAge: -1,
        httpOnly: true,
        sameSite: true, // нужен, когда один домен
      })
      .send({ // удали потом
        data: user.name,
        token,
      });
  })
  .catch((err) => {
    const error = new UnauthorizedError(err.message);
    next(error);
  });
