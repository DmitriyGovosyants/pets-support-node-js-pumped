const jwt = require('jsonwebtoken'); // Библиотека для создания токенов

const { User } = require('../models');

const { SECRET_KEY } = process.env;

const authentificate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  try {
    if (bearer !== 'Bearer') {
      return res.status(498).json({ message: 'Not authorized' });
    }
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (user.token !== token) {
      return res.status(498).json({ message: 'Invalid token' });
    }
    if (!user || !user.token) {
      return res.status(498).json({ message: 'Not authorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'invalid signature') {
      error.status = 498;
    }
    next(error);
  }
};

module.exports = {
  authentificate,
};
