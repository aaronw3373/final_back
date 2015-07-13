var express = require('express');
var router = express.Router();
var Trip = require('../models/event.js');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
}


router.post('/newTrip', isAuthenticated, function(req, res){
  var newTrip = new Trip();

  newTrip.title = req.body.title;
  newTrip.info = req.body.info;
  newTrip.location= req.body.location;
  newTrip.postedAt = new Date();
  newTrip.startDate = req.body.startDate;
  newTrip.endDate = req.body.endDate;
  newTrip.creator = req.user.username;
  newTrip.people = req.body.people;
  newTrip.catagories = req.body.catagory;

  newTrip.save(function(err) {
    if (err) {
      console.log('Error in Saving message: ' + err);
      res.end();
      throw err;
    } else {
        res.send(newTrip);
      }
   });
})

router.get('/my', isAuthenticated, function(req, res){
  Trip.find({
    people: req.user.username
  })
  .exec(function(error, trips) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.send(trips);
  });
})

router.get('/all', isAuthenticated, function(req, res){
  Trip.find({})
  .exec(function(error, trips) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.send(trips);
  });
})

router.get('/:tripId', isAuthenticated, function(req, res){
  Trip.find({
    _id: req.params.tripId
  })
  .exec(function(error, trip) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.send(trip);
  });
})


module.exports = router;
