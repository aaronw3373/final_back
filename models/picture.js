var mongoose = require('mongoose');

var pictureSchema = new mongoose.Schema({
  caption: {
    type: String
  },
  src: {
    data: Buffer,
    type: String
  },
  _creator: {
    type: String,
    ref: 'User'
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

var Picture = mongoose.model('picture', pictureSchema);

module.exports = Picture;
