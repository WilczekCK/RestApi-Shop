var express = require('express');
var router = express.Router();
var mysql = require('../controllers/mysql_controler.js');
var profile = require('../controllers/profile_controler.js');
var auth = require('../controllers/auth_controler.js');
const passport = require('passport');

router.get('/', function (req, res, next) {
  //console.log(await mysql.query('select * from test'))
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

router.post('/register', async (req, res) => {
  const profileResponse = await profile.addNew(req.body);
  res.send(profileResponse)
})

router.post('/login', async (req, res, next) => {
    await passport.authenticate('local-login', async (err, user, info) => {
      if (err) {
        console.log(err);
      }

      if (info != undefined) {
        res.status(401).send(info.message);
      } else {
        profile.login(req, user)
        .then(function(isLoggedIn){
          res.status(200).send(isLoggedIn);
        })
      }
  })(req, res, next);
});

// app.post('/login', passport.authenticate('local-login', {

//         successRedirect : '/', // redirect to the secure profile section
//         failureRedirect : '/', // redirect back to the signup page if there is an error
//         failureFlash : true // allow flash messages

//     }),
//     function(req, res) {

//         console.log("hello");

//         if (req.body.remember) {
//         req.session.cookie.maxAge = 1000 * 60 * 3;
//         } else {
//         req.session.cookie.expires = false;
//         }
//     res.redirect('/');

// })

// router.get('/login/auth', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}));

router.get('/details', function (req, res, next) { }); //get
router.post('/details', function (req, res, next) { }); //changing

router.delete('/delete', function (req, res, next) { });

module.exports = router;
