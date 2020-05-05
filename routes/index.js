const router = require('express').Router();

const userRouter = require('./users');
const articleRouter = require('./articles');
const signRouter = require('./sign');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/notFoundError');

router.use('/', signRouter);
router.use('/users', auth, userRouter);
router.use('/articles', auth, articleRouter);
router.use((req, res, next) => {
  const error = new NotFoundError('Запрашиваемый ресурс не найден');
  next(error);
});

module.exports = router;
