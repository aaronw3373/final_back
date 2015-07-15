var express = require('express');
var router = express.Router();
var Trip = require('../models/event.js');
var fuzzy = require('fuzzy');

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

router.post('/updateTrip', isAuthenticated, function(req, res){
  console.log(req.body);
  // var newTrip = new Trip();

  // newTrip.title = req.body.title;
  // newTrip.info = req.body.info;
  // newTrip.location= req.body.location;
  // newTrip.postedAt = new Date();
  // newTrip.startDate = req.body.startDate;
  // newTrip.endDate = req.body.endDate;
  // newTrip.creator = req.user.username;
  // newTrip.people = req.body.people;
  // newTrip.catagories = req.body.catagory;

  // newTrip.save(function(err) {
  //   if (err) {
  //     console.log('Error in Saving message: ' + err);
  //     res.end();
  //     throw err;
  //   } else {
  //       res.send(newTrip);
  //     }
  //  });
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

router.get('/random', isAuthenticated, function(req, res){
  Trip.find({})
  .exec(function(error, trips) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    var rand = Math.floor(Math.random() * (trips.length));
    res.send(trips[rand]);
  });
})

router.post('/search', isAuthenticated, function(req,res){
  Trip.find({}).exec(function(error, events) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }else{
      if (req.body.title){
        var titleArray = [];
        var results = fuzzy.filter(req.body.title, titleArray);
        events.forEach(function(event){
          titleArray.push(event.title);
        });
        var titleResults = fuzzy.filter(req.body.title, titleArray);
        titleEvents = [];
        titleResults.forEach(function(result){
          events.forEach(function(event){
            if (event.title === result.original){
              var repeat = false;
              titleEvents.forEach(function(test){
                if (test === event){
                  repeat = true;
                }
              })
              if (!repeat){
                titleEvents.push(event);
              }
            }
          });
        })
        if (titleEvents.length > 0){
          res.send(titleEvents);
        } else{
          res.send(req.body);
        }
      }

      // if (req.body.user){
      //   events.forEach(function(event){
      //     console.log(event.people);
      //   });
      // }

      if (!req.body.title) {
        res.send(events);
      }

    }
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
