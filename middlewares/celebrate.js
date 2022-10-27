const { celebrate, Joi } = require('celebrate');
// const validator = require('validator');

module.exports.signupValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// avatar: Joi.string().custom((value, helper) => {
//   if (!validator.isURL(value)) {
//     return helper.message('введите валидный url');
//   }
//   return value;
// }),
