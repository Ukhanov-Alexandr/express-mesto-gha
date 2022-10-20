const Card = require('../models/card');

const BAD_REQUEST_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.status(200).send(card))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
