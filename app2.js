var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv').load();

// Connect to DB
// mongoose.connect(process.env.MONGOURL);
mongoose.connect('mongodb://localhost/dbclarke');

var app = express();


//trust heroku proxy
app.set('trust proxy', 1);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({
  secret: 'mySecretKeyissomethingyoudontknow'
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var indexRoutes = require('./routes/index.js');
app.use('/', indexRoutes);

var authRoutes = require('./routes/auth.js')(passport);
app.use('/auth', authRoutes);

var userRoutes = require('./routes/users.js');
app.use('/user', userRoutes);

var statusRoutes = require('./routes/statuses.js');
app.use('/status', statusRoutes);

var pictureRoutes = require('./routes/pictures.js');
app.use('/picture', pictureRoutes);

var deleteRoutes = require('./routes/delete.js');
app.use('/delete', deleteRoutes);

var searchRoutes = require('./routes/search.js');
app.use('/search', searchRoutes);

var listingRoutes = require('./routes/listing.js');
app.use('/listing', listingRoutes);

var commentRoutes = require('./routes/comment.js');
app.use('/comment', commentRoutes);

var messageRoutes = require('./routes/messages.js');
app.use('/conversation', messageRoutes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}






module.exports = app;
