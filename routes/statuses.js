var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Status = require('../models/status.js');
var Comment = require('../models/comment.js');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
}

/* GET ALL USER STATUSES */
router.get('/allStatuses', isAuthenticated, function(req, res) {
  Status.find({
    _creator: req.user.username
  })
  .sort('-postedAt')
  .exec( function(error, statusList) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.send(statusList);
  });
});


/* Create Status */
router.post('/newStatus', isAuthenticated, function(req, res) {
  User.findOne({
    username: req.user.username
  }, function(error) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    } else {

      var newStatus = new Status();

      // set the user's status
      newStatus.input = req.param('input');
      newStatus.likes = 0;
      newStatus.postedAt = new Date();
      newStatus._creator = req.user.username;

      // save the status
      newStatus.save(function(err) {
        if (err) {
          console.log('Error in Saving status: ' + err);
          throw err;
        }
        res.status(200);
        res.end();
      });
    }

  });
});


/* LIKE Status*/
router.post('/like/:statusID', isAuthenticated, function(req, res) {
  Status.findOne({"_id":req.params.statusID}).exec( function(err, status) {
    if (err) {
      console.log(err);
      res.status(404);
      res.end();
    } else {
      var liked = false;
      for (var i = 0; i < status.likers.length; i++) {
        if (status.likers[i] === req.user.username) {
          liked = true;
        }
      }
      if (liked === false) {
        var newLikes = status.likes + 1;
        status.likers.push(req.user.username);
        Status.findOneAndUpdate({"_id":req.params.statusID}, {likes: newLikes,likers: status.likers}, function(err, status) {
          if (err) {
            console.log(err);
            res.status(404);
            res.end();
          } else {
            res.status(200);
            res.end();
          }
        });
      } else {
        console.log("already liked");
        res.status(404);
        res.end();
      }
    }
  });
});

/* GET One USER STATUSES */
router.get('/:statusID', isAuthenticated, function(req, res) {
  Status.findOne({
    _id: req.params.statusID
  }, function(error, status) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    Comment.find({
      _post: 'status' + req.params.statusID
    }, function(error, comments) {
      if (error) {
        console.log(error);
      }
      res.send(status,comments)
    });
  });
});

/* Post picture comment */
router.post('/:src/newComment', isAuthenticated, function(req, res) {
  var newComment = new Comment();
  newComment._post = 'status' + req.params.src;
  newComment.input = req.param('input');
  newComment.likes = 0;
  newComment.postedAt = new Date();
  newComment._creator = req.user.username;
  newComment.save(function(err) {
    if (err) {
      console.log('Error in Saving comment: ' + err);
      res.end();
      throw err;
    } else {
        console.log(newComment);
        res.status(200);
        res.end();
      }
   });
});

module.exports = router;

