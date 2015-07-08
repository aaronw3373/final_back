var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Status = require('../models/status.js');
var Picture = require('../models/picture.js');
var Comment = require('../models/comment.js');
var Conversation = require('../models/conversation.js');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
}


/* DELETE user */
  router.delete('/user', isAuthenticated, function(req, res) {
    User.remove({
        username: req.user.username
      },
      function(error) {
        if (error) {
          console.error(error);
          res.status(404);
          res.end();
        }
        res.status(204);
        res.end();
      });
  });


/* Delete Status */
router.delete('/status/:statusID', isAuthenticated, function(req, res) {
  Status.remove({
    _id: req.params.statusID
  })
  .exec(function(error) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.status(204);
    res.end();
  });
});

/* Delete Picture */
router.delete('/picture/:pictureID', isAuthenticated, function(req, res) {
  Picture.remove({
    _id: req.params.pictureID
  })
  .exec(function(error) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.status(204);
    res.end();
  });
});

/* Delete Comment */
router.delete('/comment/:commentID', isAuthenticated, function(req, res) {
  Comment.remove({
    _id: req.params.commentID
  })
  .exec(function(error) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.status(204);
    res.end();
  });
});

/* Delete Conversation */
router.delete('/convo/:convoID', isAuthenticated, function(req, res) {
  Conversation.remove({
    _id: req.params.convoID
  })
  .exec(function(error) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.status(204);
    res.end();
  });
});

module.exports = router
