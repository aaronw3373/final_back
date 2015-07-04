var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
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
  _post: {
    type: String
  },
  postedAt: {
    type: Date,
    required: true
  }
});


var Comment = mongoose.model('comment', commentSchema);


module.exports = Comment;
