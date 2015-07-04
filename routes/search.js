var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var fuzzy = require('fuzzy');

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

// FIXEME: add fuzzy match and search by more than username


/*search for a user*/
router.post('/', isAuthenticated, function(req, res) {
  User.find({
  })
    .select('-password')
    .exec(function(error, users) {
      if (error) {
        console.log(error);
        res.status(404);
        res.end();
      }
      var usernameArray = []
      users.forEach(function(user){
        usernameArray.push(user.username);
      });
      var results = fuzzy.filter(req.body.q, usernameArray);
      if (results.length > 0){
        res.redirect('/user/'+ results[0].string)
      } else {
        res.redirect('/auth/home');
      }
    });
});

module.exports = router;
