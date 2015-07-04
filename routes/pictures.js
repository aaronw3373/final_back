var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Status = require('../models/status.js');
var Picture = require('../models/picture.js');
var Comment = require('../models/comment.js');
var async = require('async');
var fs = require('fs');
var multer = require('multer');
var AWS = require('aws-sdk');
var bodyParser = require('body-parser');
require('dotenv').load();


var aws_access_key =  process.env.AWS_ACCESS_KEY_ID;
var aws_secret_key = process.env.AWS_SECRET_KEY_ID;


var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

/* GET ALL USER Pictures */
router.get('/allPictures', isAuthenticated, function(req, res) {
  Picture.find({
    _creator: req.user.username
  })
  .sort('-postedAt')
  .exec( function(error, pictures) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end();
    }
    res.render('listing', {
      title: 'Pictures',
      user:req.user,
      listing: pictures
    });
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
            res.redirect('/picture/' + req.params.pictureID);
          } else {
            res.redirect('/picture/' + req.params.pictureID);
          }
        });
      } else {
        res.redirect('/picture/' + req.params.pictureID);
      }
    }
  });
});

/*POST PICTURES*/
AWS.config.update({
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_key
});

var s3 = new AWS.S3();

router.use(bodyParser({uploadDir:'./uploads'}));

router.use(multer({
  limits : { fileSize:10000000 },
  rename: function (pictures, src) {
    return src.replace(/\W+/g, '-').toLowerCase();
  }
}));

router.post('/upload', isAuthenticated, function(req, res) {
  if(req.files !== undefined) {
    fs.readFile(req.files.thumbnail.path, function(err, data){
      var params = {
        Bucket: 'clarkedbteer',
        Key: req.files.thumbnail.name,
        Body: data
      };
    s3.putObject(params, function (perr, pres) {
      if (perr) {
        console.log("Error uploading data: ", perr);
      } else {
        console.log("Successfully uploaded data to clarkedbteer");
        User.findOne({
          username: req.user.username
        }, function(error) {
        if (error) {
          console.log(error);
          res.status(404);
          res.end();
        } else {
          var newPicture = new Picture();
          // set the user's picture
          newPicture.src = req.files.thumbnail.name;
          newPicture.caption = req.param('caption');
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
                res.redirect('/picture/allPictures');
              }
            });
          }
        });
        }
      });
    })
  }
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
      res.render('picture',{
        user: req.user,
        picture: picture,
        comments: comments
      })
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
        res.redirect('/picture/' + req.params.src);
      }
   });
});



module.exports = router;
