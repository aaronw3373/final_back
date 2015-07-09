var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var fuzzy = require('fuzzy');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
}

// FIXEME: add fuzzy match and search by more than username
router.post('/newTrip', isAuthenticated, function(req, res) {
  console.log(req.body.query);
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
      var results = fuzzy.filter(req.body.query, usernameArray);
      if (results.length > 0){
        console.log(results[0]);
        res.send(results[0].original)
      } else {
        res.status(404);
        res.end();
      }
    });
});

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
