const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request'); // 400
// const UnauthorizedError = require('../errors/unauthorized'); // 401
const ForbiddenError = require('../errors/forbidden'); // 403
const NotFoundError = require('../errors/not-found'); // 404
// const ConflictError = require('../errors/conflict'); // 409

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => { res.send(movies); })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner
  })
    .then((movie) => { res.send(movie); })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Некорректный запрос'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).orFail(() => {
    throw new NotFoundError('Неверный id фильма');
  })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        movie.remove();
        res.status(200).send({ message: 'фильм успешно удален' });
      } else {
        throw new ForbiddenError('Вы не можете удалить этот фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный запрос'));
      }
      return next(err);
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
