const usersRouter = require('express').Router();
const {
  getUsers, getUser, getUserInfo, updateUser, updateUserAvatar,
} = require('../controllers/users');
const { idValidate, userProfileValidate, avatarValidate } = require('../middlewares/celebrate');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUserInfo);
usersRouter.get('/:id', idValidate, getUser);
usersRouter.patch('/me', userProfileValidate, updateUser);
usersRouter.patch('/me/avatar', avatarValidate, updateUserAvatar);

module.exports = usersRouter;
