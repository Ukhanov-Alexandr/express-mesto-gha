const Card = require('../models/card');
const {
  BAD_REQUEST_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  NotFoundError,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send(card))
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
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req.user._id);

  Card.findById(req.params.id)
    .orFail(new NotFoundError())
    .then((card) => {
      const ownerId = req.user._id;
      // eslint-disable-next-line no-console
      console.log(card.owner);
      if (card.owner.toString() === ownerId.toString()) {
        card.delete()
          .then(() => { res.send(`Карта ${card} - успешно удалена`); });
      } else {
        throw new Error('Вы не можете удалть чужую карточку!');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при удалении карточки' });
      }
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError())
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } if (err.name === 'NotFoundError') {
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
    .orFail(new NotFoundError())
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
