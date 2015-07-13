var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
}

module.exports = function(passport) {

  /* Handle Login POST */
  router.post('/login',passport.authenticate('login'),
   function(req, res) {
      res.status(200);
      res.end();
    });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.status(202);
    res.end();
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup'),
    function(req, res){
      res.status(201);
      res.end();
  });

  router.get('/user', isAuthenticated, function(req, res) {
    res.send(req.user);
  });

  /* PATCH user */
  // router.post('/patch/user', isAuthenticated, function(req, res) {
  //   User.findOneAndUpdate({
  //     username: req.user.username
  //   }, req.body, function(err, user) {
  //     if (err) {
  //       console.log(err);
  //       res.status(404);
  //       res.end();
  //     } else {
  //       res.status(200);
  //       res.end();
  //     }
  //   });
  // });


  return router;
}
