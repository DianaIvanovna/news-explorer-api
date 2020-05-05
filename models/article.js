// models/article.js
const mongoose = require('mongoose'); // В MongoDB нет поддержки схем по умолчанию, но есть в Mongoose
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'is not a valid Url',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'is not a valid Url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
