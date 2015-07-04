var mongoose = require('mongoose');

var statusSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  likers: [],
  _creator: {
    type: String,
    ref: 'User'
  },
  postedAt: {
    type: Date,
    required: true
  }
});


var Status = mongoose.model('status', statusSchema);


module.exports = Status;
