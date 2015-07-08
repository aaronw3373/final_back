var express = require('express');
var router = express.Router();
var Comment = require('../models/comment.js');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
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
            res.status(200)
            res.end();
          }
        });
      } else {
        res.status(404);
        res.end();
      }
    }
  });
});


module.exports = router;
