const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '«Жак-Ив Кусто»',
    minlength: 2,
    maxlength: 30,
    message: 'поле должно содержать от 2 до 30 символов!',
  },
  about: {
    type: String,
    default: '«Исследователь»',
    minlength: 2,
    maxlength: 30,
    message: 'поле должно содержать от 2 до 30 символов!',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Введите email!',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, {
  versionKey: false,
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // console.log(user.password, password)
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          console.log(matched);
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
