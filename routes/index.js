var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  // PRODUCTION MODE
  if (req.secure) {
    res.render('index', {
      message: req.flash('message')
    });
  }
  else {
    res.redirect('https://clarkesocial.herokuapp.com');
  }

  //DEV MODE
  // res.render('index', {
  //   message: req.flash('message')
  // });
});

/* GET About Page */
router.get('/about', function(req, res) {
  res.render('about');
});

/* GET Contact Page */
router.get('/contact', function(req, res) {
  res.render('contact');
});

module.exports = router;
