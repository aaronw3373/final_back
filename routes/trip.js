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


router.post('/newTrip', function(req, res){

})


router.get('/:tripId', function(req, res){

})


module.exports = router;
