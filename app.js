const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { NOT_FOUND_ERROR_CODE } = require('./errors/errors');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb')
  // eslint-disable-next-line no-console
  .then(() => console.log('«Соединение с базой данных успешно»'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err, '«Ошибка подключения к базе данных»'));

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый ресурс не найден' }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
