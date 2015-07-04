var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  _creator: {
    type: String,
    ref: 'User'
  },
  postedAt: {
    type: Date,
    required: true
  },
  conversation: {

  },
  recipients: []
});


var Message = mongoose.model('message', messageSchema);


module.exports = Message;
