var express = require('express');
var router = express.Router();
var Conversation = require('../models/conversation.js');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    res.status(401);
    res.end();
  }
}

/* Post picture Message */
router.post('/newConversation', isAuthenticated, function(req, res) {
  var recipientsArray = [req.user.username]
  var reciptientsHash = [{username:req.user.username,newMessage: false}]
  var recipients = req.body.recipients.replace(/\s+/g,'').split(',');
  recipients.forEach(function(recipient) {
    recipientsArray.push(recipient);
    reciptientsHash.push({username:recipient,newMessage:true});
  })
  var newConversation = new Conversation();
  newConversation.title = req.param('title');
  newConversation.postedAt = new Date();
  newConversation._creator = req.user.username;
  newConversation.recipients = recipientsArray;
  newConversation.messages.push({
    _creator: req.user.username,
    postedAt: new Date(),
    input: req.param('input'),
    recipients: reciptientsHash
  });
  newConversation.save(function(err) {
    if (err) {
      console.log('Error in Saving message: ' + err);
      res.end();
      throw err;
    } else {
        res.status(200);
        res.end();
      }
   });
});

/* Post picture Message */
router.post('/:convoID/newMessage', isAuthenticated, function(req, res) {
  Conversation.findOne({
    _id: req.params.convoID
  }, function(error,Convo) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end()
    } else {
      var reciptientsHash = []
      var recipients = Convo.recipients;
      recipients.forEach(function(recipient) {
        if (recipient === req.user.username){
          reciptientsHash.push({username:recipient,newMessage:false});
        } else {
          reciptientsHash.push({username:recipient,newMessage:true});
        }
      })
      Convo.messages.push({
        _creator: req.user.username,
        postedAt: new Date(),
        input: req.param('input'),
        recipients: reciptientsHash
      });
      Convo.save(function(err) {
        if (err) {
          console.log('Error in Saving message: ' + err);
          res.end();
          throw err;
        } else {
          console.log(Convo);
          res.status(200);
          res.end();
        }
      });
    }
  })
});

router.get('/all',isAuthenticated,function(req,res) {
  Conversation.find({
    recipients: req.user.username
  }, function(error,convos) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end()
    } else {
      res.send(convos);
    }
  });
})

router.get('/:convoID',isAuthenticated,function(req,res) {
  Conversation.findOne({
    _id: req.params.convoID
  }, function(error,convo) {
    if (error) {
      console.log(error);
      res.status(404);
      res.end()
    } else {
      res.send(convo);
    }
  });
})


module.exports = router;
