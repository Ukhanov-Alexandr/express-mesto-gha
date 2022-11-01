const { celebrate, Joi } = require('celebrate');

const urlCheck = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

module.exports.signupValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helper) => {
      if (!urlCheck.test(value)) {
        return helper.message('Введите ссылку!');
      }
      return value;
    }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.idValidate = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
});

module.exports.userProfileValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.avatarValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helper) => {
      if (!urlCheck.test(value)) {
        return helper.message('Введите ссылку!');
      }
      return value;
    }),
  }),
});
