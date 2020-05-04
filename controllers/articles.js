const Article = require('../models/article');
const NotFoundError = require('../errors/notFoundError');

module.exports.getArticles = (req, res, next) => {
  // возвращает все сохранённые пользователем статьи
  Article.find({})
    .then((article) => res.send(article))
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
    .catch((err) => {
      console.log(err);
      next();
    });
};

module.exports.deleteArticles = (req, res, next) => {
  // удаляет сохранённую статью  по _id
  console.log(req.params.articlesId);

  Article.findByIdAndRemove(req.params.articlesId)
    .then((article) => {
      if (article == null) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return res.send({ data: article });
    })
    .catch(next);
};