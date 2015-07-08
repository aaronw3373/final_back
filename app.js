var express = require('express');
var express_session = require('express-session');
var MongoStore = require('connect-mongo')(express_session);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var cors = require('cors');
var passport = require('passport');
require('dotenv').load();

var app = express();

// Connect to DB
mongoose.connect(config.mongo.dbUrl);

var mongoStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions'
});

if (config.env === 'production'){
    app.set('trust proxy', 1);
}

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('JustTryAndGuess'));

// Configuring Passport
app.use(express_session({
  secret: 'JustTryAndGuess',
  store: mongoStore,
  resave: false,
  saveUnitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport/init');
initPassport(passport);


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
        res.send(err.message);
    });
}

module.exports = app;
