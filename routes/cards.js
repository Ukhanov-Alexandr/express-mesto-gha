const cardsRouter = require('express').Router();
const { idValidate, cardValidate } = require('../middlewares/celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardValidate, createCard);
cardsRouter.delete('/:id', idValidate, deleteCard);
cardsRouter.put('/:id/likes', idValidate, likeCard);
cardsRouter.delete('/:id/likes', idValidate, dislikeCard);

module.exports = cardsRouter;
