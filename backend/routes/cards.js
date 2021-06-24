const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { cardSchemaValidator, cardIdValidator } = require('../utils/validators');

router.get('/', getCards);
router.post('/', cardSchemaValidator, createCard);
router.delete('/:cardId', cardIdValidator, deleteCardById);
router.put('/likes/:cardId', cardIdValidator, likeCard);
router.delete('/likes/:cardId', cardIdValidator, dislikeCard);

module.exports = router;
