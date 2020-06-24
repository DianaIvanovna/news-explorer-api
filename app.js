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

mongoose.connect(CONNECTION_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
// 'https://news-explorer-api.gq/' || 'http://news-explorer-api.gq/' || 'https://www.news-explorer-api.gq/' || 'https://www.news-explorer-api.gq/',

const corsOptions = {
  origin: 'https://news-explorer-api.gq' || 'http://news-explorer-api.gq' || 'https://www.news-explorer-api.gq' || 'https://www.news-explorer-api.gq',
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
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
