class AuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizedError';
    this.statusCode = 401;
  }
}

module.exports = AuthorizedError;
