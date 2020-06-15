// app.js
require('dotenv').config(); // загружает переменные среды из .envфайла process.env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); // доп защита Экспресс-приложения. Устанавливает нужные заголовки для HTTP
const cors = require('cors'); // библиотека, чтобы сайт мог отправлять запросы
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const errorsHandler = require('./middlewares/errorHandler');
const { CONNECTION_ADDRESS, PORT, RATE_LIMIT } = require('./config');

const whitelist = [' https://news-explorer-api.gq/', ' http://news-explorer-api.gq/', 'https://www.news-explorer-api.gq/', 'https://www.news-explorer-api.gq/'];

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

mongoose.connect(CONNECTION_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();
app.get('/', cors(corsOptions), (req, res, next) => {
  res.json({ msg: 'This is CORS-enabled for a whitelisted domain.' });
  next();
});
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit(RATE_LIMIT));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов
app.use('/', router);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorsHandler);

app.listen(PORT);
