const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return (v >= 2 && v <= 30);
      },
      message: 'поле должно содержать от 2 до 30 символов!',
    },
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return (v >= 2 && v <= 30);
      },
      message: 'поле должно содержать от 2 до 30 символов!',
    },
  },
  avatar: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);
