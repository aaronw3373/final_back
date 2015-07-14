var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var crypto = require("crypto");
var Picture = require('../models/picture.js');
var Comment = require('../models/comment.js');
var async = require('async');
var fs = require('fs');
var multer = require('multer');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
var smushit = require('node-smushit');
require('dotenv').load();


var aws_access_key =  process.env.AWS_ACCESS_KEY_ID;
var aws_secret_key = process.env.AWS_SECRET_KEY_ID;

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
}

var s3_upload_signature = function(base64Policy){
  var sig = crypto.createHmac("sha1", aws_secret_key).update(base64Policy).digest("base64");
  return sig;
}

var create_s3_upload_policy = function(){
  var date = new Date();
  date.setDate(date.getDate() + 1);

  var s3Policy = {
    "expiration": date,
    "conditions": [
      ["starts-with", "$key", ""],
      {"bucket": "powplanner"},
      {"acl": "public-read"},
      ["starts-with", "$Content-Type", ""],
      [ "content-length-range", 0, 20 * 1024 * 1024 ]
      // ,
      // ["starts-with", "$success_action_redirect", "http://localhost:3050/picture/save"]
    ]
  };

  // stringify and encode the policy
  var stringPolicy = JSON.stringify(s3Policy);
  // console.log("policy:",stringPolicy);
  var base64Policy = Buffer(stringPolicy, "utf-8").toString("base64");
  // console.log("policy ",base64Policy);
  var token = {
    policy: base64Policy,
    signature: s3_upload_signature(base64Policy),
    key: aws_access_key
  }
  // console.log(token);
  return token;
}

router.get('/s3access', isAuthenticated, function(req, res){
  var token = create_s3_upload_policy();
  res.json(token);
});


/* GET ALL USER Pictures */
router.get('/allPictures', isAuthenticated, function(req, res) {
  Picture.find(
  {
    _creator: req.user.username
  }
  )
  .sort('-postedAt')
  .exec( function(error, pictures) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.send(pictures);
  });
});


/*Like*/
router.post('/like/:pictureID', isAuthenticated, function(req, res) {
  Picture.findOne({"_id":req.params.pictureID}).exec( function(err, picture) {
    if (err) {
      console.log(err);
      res.status(404);
      res.end();
    } else {
      var liked = false;
      for (var i = 0; i < picture.likers.length; i++) {
        if (picture.likers[i] === req.user.username) {
          liked = true;
        }
      }
      if (liked === false) {
        var newLikes = picture.likes + 1;
        picture.likers.push(req.user.username);
        Picture.findOneAndUpdate({"_id":req.params.pictureID}, {likes: newLikes,likers: picture.likers}, function(err, picture) {
          if (err) {
            console.log(err);
            res.status(404);
            res.end()
          } else {
            res.status(200);
            res.end();
          }
        });
      } else {
        res.status(200);
        res.end();
      }
    }
  });
});

router.post('/save', isAuthenticated, function(req, res) {
  console.log(req.body);
  res.send(req.body);
  var newPicture = new Picture();
  // set the user's picture
  newPicture.src = req.body.src;
  newPicture.caption = req.body.caption;
  newPicture.likes = 0;
  newPicture.postedAt = new Date();
  newPicture._creator = req.user.username;
  // console.log(newPicture);
  // save the picture
  newPicture.save(function(err) {
    if (err) {
      console.log('Error in Saving status: ' + err);
      res.end();
      throw err;
    } else {
        console.log('picture saved!');
        res.status(200);
        res.end();
      }
    });
});

/* GET One USER PICTURES */
 router.get('/:src', isAuthenticated, function(req, res) {
  Picture.findOne({
     _id: req.params.src
  }, function(error, picture) {
  if (error) {
    console.log(error);
    res.status(404);
    res.end();
   }
   Comment.find({
      _post: 'picture' + req.params.src
    }, function(error, comments) {
      if (error) {
        console.log(error);
      }
      res.send(picture, comments);
    });
  });
});

/* Post picture comment */
 router.post('/:src/newComment', isAuthenticated, function(req, res) {
  var newComment = new Comment();
  newComment._post = 'picture' + req.params.src;
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
