const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { idValidate } = require('../middlewares/celebrate');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:id', idValidate, deleteCard);
cardsRouter.put('/:id/likes', idValidate, likeCard);
cardsRouter.delete('/:id/likes', idValidate, dislikeCard);

module.exports = cardsRouter;
