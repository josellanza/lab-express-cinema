'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const saltRounds = 10;

router.get('/signup', (req, res, next) => {
  // if the user is already loggedin, we redirect
//   if (req.session.currentUser) {
//     res.redirect('/');
//     return;
//   }
  //   if the user is not login, we render the signup
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    password: hashedPassword
  });

  newUser.save()
    .then(() => {
      req.session.currentUser = newUser;
      res.redirect('/movies');
    })
    .catch(next);
});
module.exports = router;
