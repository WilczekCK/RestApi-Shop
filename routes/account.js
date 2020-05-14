var express = require('express');
var router = express.Router();
var mysql = require('../controllers/mysql_controler.js');
var profile = require('../controllers/profile_controler.js');
var auth = require('../controllers/auth_controler.js');
const passport = require('passport');

let userId;

router.get('/', function (req, res, next) {
  //console.log(await mysql.query('select * from test'))
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

router.post('/register', async (req, res) => {
  const profileResponse = await profile.addNew(req.body);
  res.send(profileResponse)
})

router.post('/login', async (req, res, next) => {
  auth.login(req, res, next).then( isLoggedIn => {
      res.send( isLoggedIn );
  }, err => console.log(err) )
});

router.get('/details', function (req, res, next) { }); //get

router.patch('/details', async function (req, res, next) {
  await auth.authenticate(req, res).then( async(userID)=> {
    const changeResponse = await profile.changeInfo(req.body);
    res.status(changeResponse.status).send(changeResponse);
  }, err => console.log(err) )
});

router.delete('/delete', async function (req, res, next) {
  await auth.authenticate(req, res).then( async(userID)=> {
    const deletionResponse = await profile.remove(req.body);
    res.status(deletionResponse.status).send(deletionResponse);
  }, err => console.log(err) )  
});

router.get('/details', async(req, res, next) => {
  auth.authenticate(req, res, next).then(async(userId)=> {
    const response = await profile.lookForProfile(`id = ${userId}`)
    res.status(200).send(response);
  }, err => console.log(err) )
});

module.exports = router;
