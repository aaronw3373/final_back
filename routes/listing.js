var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Status = require('../models/status.js');
var Picture = require('../models/picture.js');

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

/*GET my listing*/
router.get('/', isAuthenticated, function(req, res) {
    User.findOne({username: req.user.username},function(error, user){
    if (error) {
      console.log(error)
    } else {
      var array = [];
      var length = 0;
      var followLength = user.following.length;
      for (var i = 0;i<followLength;i++) {
        User.findOne({username: user.following[i]},function(error, follower) {
          if (error) {
            console.log(error);
            followLength = followLength - 1;
          } else {

            Status.find({
              _creator: follower.username
            })
            .sort('-postedAt')
            .exec( function(error, statusList) {
              if (error) {
                console.log(error);
                res.status(404);
                res.end();
              } else {
                statusList.forEach(function(status) {
                  array.push(status);
                })
                }
              });

            Picture.find({
              _creator: follower.username
            })
            .sort('-postedAt')
            .exec( function(error, pictureList) {
              if (error) {
                console.log(error);
                res.status(404);
                res.end();
              } else {
                pictureList.forEach(function(picture) {
                  array.push(picture);
                })
                length +=1;
                if(length === followLength){
                  array.sort(function (a, b) {
                    if (a.postedAt.getTime() > b.postedAt.getTime()) {
                      return -1;
                    }
                    if (a.postedAt.getTime() < b.postedAt.getTime()) {
                      return 1;
                    }
                    return 0;
                  });
                  res.render('listing', {
                    title: 'Newsfeed',
                    user:req.user,
                    listing: array
                  });
                }
              }
            });
          }
        });
      }
    }
  });
});

module.exports = router;
