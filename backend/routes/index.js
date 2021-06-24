const router = require('express').Router();
const { errors, isCelebrateError } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { userValidator } = require('../utils/validators');
const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');

router.use(requestLogger);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', userValidator, login);
router.post('/signup', userValidator, createUser);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use(errorLogger);

router.use((req, res, next) => next(new NotFoundError('Ресурс не найден')));

router.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    next(new InvalidDataError('Переданы некорректные данные.'));
  }
  next(err);
});
router.use(errors());

module.exports = router;
