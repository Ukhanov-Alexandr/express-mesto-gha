const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND_ERROR_CODE } = require('./errors/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb')
  // eslint-disable-next-line no-console
  .then(() => console.log('«Соединение с базой данных успешно»'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err, '«Ошибка подключения к базе данных»'));

app.use((req, res, next) => {
  req.user = {
    _id: '6350038065b87324cb47fe8a',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый ресурс не найден' }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
