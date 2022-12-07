const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request'); // 400
const UnauthorizedError = require('../errors/unauthorized'); // 401
// const ForbiddenError = require('../errors/forbidden'); // 403
const NotFoundError = require('../errors/not-found'); // 404
const ConflictError = require('../errors/conflict'); // 409

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({
        name, email, password: hash
      })
        .then(() => {
          res.send({
            name, email
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Введены неверные данные'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
          }
          return next(err);
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      return next(new UnauthorizedError('Ошибка при авторизации'));
    });
};

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true }).orFail(new Error('NotFound'))
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректный запрос'));
      }
      return next(err);
    });
};

module.exports = {
  createUser, login, getProfile, updateProfile
};
