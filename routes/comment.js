var express = require('express');
var router = express.Router();
var Comment = require('../models/comment.js');

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

/*Like*/
router.post('/like/:commentID', isAuthenticated, function(req, res) {
  Comment.findOne({"_id":req.params.commentID}).exec( function(err, comment) {
    if (err) {
      console.log(err);
      res.status(404);
      res.end();
    } else {
      var liked = false;
      for (var i = 0; i < comment.likers.length; i++) {
        if (comment.likers[i] === req.user.username) {
          liked = true;
        }
      }
      var path = '/';
      if (comment._post.substring(0,6) === "status") {
        path += 'status/' + comment._post.substring(6);
      } else if (comment._post.substring(0,7) === "picture") {
        path += 'picture/' + comment._post.substring(7);
      }
      if (liked === false) {
        var newLikes = comment.likes + 1;
        comment.likers.push(req.user.username);
        Comment.findOneAndUpdate({"_id":req.params.commentID}, {likes: newLikes,likers: comment.likers}, function(err, comment) {
          if (err) {
            console.log(err);
            res.status(404);
            res.end();
          } else {
            res.redirect(path);
          }
        });
      } else {
        res.redirect(path);
      }
    }
  });
});


module.exports = router;
