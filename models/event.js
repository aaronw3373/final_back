var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  creator: {
    type: String,
    ref: 'User'
  },
  catagories: {},
  people: []
});


var trip = mongoose.model('trip', tripSchema);


module.exports = trip;
