const routerArticles = require('express').Router(); // создала роутер
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/badRequestError');
const {
  getArticles, createArticles, deleteArticles,
} = require('../controllers/articles');

routerArticles.get('/', getArticles);

routerArticles.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value) => {
      if (!validator.isURL(value)) {
        throw new BadRequestError('link: is not a valid Url');
      }
      return value;
    }),
    image: Joi.string().required().custom((value) => {
      if (!validator.isURL(value)) {
        throw new BadRequestError('image: is not a valid Url');
      }
      return value;
    }),
  }),
}), createArticles);

routerArticles.delete('/:articlesId', celebrate({
  params: Joi.object().keys({
    articlesId: Joi.string().alphanum().length(24),
  }),
}), deleteArticles);

module.exports = routerArticles;
