// controllers/articles.js
const Article = require('../models/article');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const Forbidden = require('../errors/forbidden');

module.exports.getArticles = (req, res, next) => {
  // возвращает все сохранённые пользователем статьи
  Article.find({ owner: req.user._id })
    .populate({ path: 'owner', model: User })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

module.exports.createArticles = (req, res, next) => {
  // создаёт статью с переданными в теле
  // keyword, title, text, date, source, link и image
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports.deleteArticles = (req, res, next) => {
  // удаляет сохранённую статью  по _id
  Article.findById(req.params.articlesId).select('+owner')
    .then((article) => {
      if (article == null) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (String(article.owner) !== req.user._id) {
        throw new Forbidden('Вы не можете удалять чужие карточки');
      }
      article.remove()
        .then((data) => {
          res.send({ message: 'Эта статья была удалена', data });
        })

        .catch(next);
      // return res.send({ data: article });
    })
    .catch(next);
};
