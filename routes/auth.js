'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const saltRounds = 10;

router.get('/signup', (req, res, next) => {
  // if the user is already loggedin, we redirect
  if (req.session.currentUser) {
    res.redirect('/movie');
    return;
  }
  //   if the user is not login, we render the signup
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  if (!req.body.username || !req.body.password) {
    // message please provide a username and password
    res.redirect('/auth/signup');
    return;
  }
  User.findOne({username: req.body.username})
    .then((user) => {
      if (user) {
        res.redirect('/auth/signup');
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword
      });

      return newUser.save()
        .then(() => {
          req.session.currentUser = newUser;
          res.redirect('/movies');
        });
    })
    .catch(next);
});

router.get('/login', (req, res, next) => {
  // if the user is already loggedin, we redirect
  if (req.session.currentUser) {
    res.redirect('/movies');
    return;
  }
  //   if the user is not login, we render the login
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  if (!req.body.username || !req.body.password) {
    res.redirect('/auth/login');
    return;
  }
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.redirect('/auth/login');
        return;
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.redirect('/auth/login');
        return;
      }
      req.session.currentUser = user;
      res.redirect('/movies');
    })
    .catch(next);
});

router.post('/logout', (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/auth/login');
});

module.exports = router;
