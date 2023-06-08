const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Unauthorized access');
  }

  const bearer = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(bearer, process.env.JWT_SCRETE);

    req.user = { userId: payload.userId, name: payload.name };

    next();
  } catch (error) {
    throw new UnauthenticatedError('Unauthorized access');
  }
};

module.exports = auth;
