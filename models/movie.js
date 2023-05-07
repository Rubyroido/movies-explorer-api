const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    required: true,
    type: String
  },
  director: {
    required: true,
    type: String
  },
  duration: {
    required: true,
    type: Number
  },
  year: {
    required: true,
    type: String
  },
  description: {
    required: true,
    type: String
  },
  image: {
    required: true,
    type: String,
    validate: {
      validator: (url) => { return isURL(url); },
      message: 'Некорректная ссылка'
    }
  },
  trailerLink: {
    required: true,
    type: String,
    validate: {
      validator: (url) => { return isURL(url); },
      message: 'Некорректная ссылка'
    }
  },
  thumbnail: {
    required: true,
    type: String,
    validate: {
      validator: (url) => { return isURL(url); },
      message: 'Некорректная ссылка'
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  movieId: {
    type: Number,
    required: true
  },
  nameRU: {
    required: true,
    type: String
  },
  nameEN: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model('movie', movieSchema);
