var express = require('express');
var router = express.Router();
var mysql = require('../controllers/mysql_controler.js');
var profile = require('../controllers/profile_controler.js');
var auth = require('../controllers/auth_controler.js');
var passport = require('passport');
auth.passport.init();
router.get('/', function(req, res, next) {
    //console.log(await mysql.query('select * from test'))
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

router.get('/register', async (req, res) => {
    const profileResponse = await profile.addNew(req.body);
    res.send(profileResponse)
})


router.get('/login', async function(req, res, next) {

});
router.get('/login/auth', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}));

router.get('/details', function(req, res, next) {}); //get
router.post('/details', function(req, res, next) {}); //changing

router.delete('/delete', function(req, res, next) {});

module.exports = router;
