const { TOKEN_KEY = 'some-secret-key' } = process.env;
const jwt = require('jsonwebtoken');
const AuthorizedError = require('../errors/AuthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, TOKEN_KEY);
  } catch (err) {
    throw new AuthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
