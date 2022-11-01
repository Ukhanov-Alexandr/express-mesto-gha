const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthorizedError = require('../errors/AuthorizedError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      const ownerId = req.user._id;
      if (card.owner.toString() === ownerId.toString()) {
        card.delete()
          .then(() => { res.send(`Карта ${card._id} - успешно удалена`); });
      } else {
        throw new AuthorizedError('Вы не можете удалть чужую карточку!');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при удалении карточки');
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки/снятии лайка');
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки/снятии лайка');
      }
      next(err);
    });
};
