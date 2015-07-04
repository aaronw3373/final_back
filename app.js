var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.mongo.dbUrl);

var app = express();
if (config.env === 'production'){
    app.set('trust proxy', 1);
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({secret: 'JustTryAndGuess'}));
app.use(passport.initialize());
app.use(passport.session());

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
