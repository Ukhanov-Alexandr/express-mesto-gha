const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  NotFoundError,
} = require('../errors/errors');

// const { TOKEN_KEY = 'some-secret-key' } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Передан некорректный _id пользователя' });
      }
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // eslint-disable-next-line no-console
  console.log(name, about, avatar, email, password);

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      // console.log(err)
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
      // eslint-disable-next-line no-new
      } else { throw new Error('Пользователь не найден'); }
    })
    .catch((err) => next(err));
};

module.exports.updateUser = async (req, res) => {
  const { name, about } = req.body;
  // eslint-disable-next-line no-console
  console.log(req.user._id);

  await User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true // если пользователь не найден, он будет создан
    },
  )
    .orFail(new NotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  return User.findUserByCredentials(email, password)
    // console.log(password)
    .then((user) => {
      // eslint-disable-next-line no-console
      // const { _id } = user._id;
      // console.log(user._id.toString());
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // eslint-disable-next-line no-console
      console.log(token);
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      })
        .json({ message: 'Logged in successfully 😊 👌' });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
