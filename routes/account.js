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

router.get('/details', function (req, res, next) { }); //get
router.post('/details', function (req, res, next) { }); //changing

router.delete('/delete', function (req, res, next) { });

module.exports = router;
