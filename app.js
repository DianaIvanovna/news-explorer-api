// app.js
require('dotenv').config(); // загружает переменные среды из .envфайла process.env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // доп защита Экспресс-приложения. Устанавливает нужные заголовки для HTTP
const { celebrate, Joi, errors } = require('celebrate');
const routerArticles = require('./routes/articles');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;
const { createUser, getUserInfo, login } = require('./controllers/users');

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser); // работает

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login); // работает

app.use(auth); // работает

app.get('/users/me', getUserInfo); // работает

app.use('/articles', routerArticles); // работает

app.use((req, res, next) => {
  const error = new NotFoundError('Запрашиваемый ресурс не найден');
  next(error);
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate

/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res
    .status(statusCode)
    .send({ // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : err.message,
    });
});

app.listen(PORT);
