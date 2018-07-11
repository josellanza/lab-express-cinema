'use strict';

const express = require('express');
const router = express.Router();

const Movie = require('../models/movie.js');

// get movies

router.get('/', (req, res, next) => {
  Movie.find()
    .then(movies => {
      console.log(movies);
      res.render('movies', {movies: movies});
    })
    .catch(error => {
      console.log(error);
    });
});

// get movie detail

router.get('/:id', (req, res, next) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .then(movie => {
      res.render('movie-detail', {movie: movie});
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
