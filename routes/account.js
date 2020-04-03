var express = require('express');
var router = express.Router();
var mysql = require('../controllers/mysql_controler.js');

router.get('/', function(req, res, next) {
    //console.log(await mysql.query('select * from test'))
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

router.post('/register', function(req, res, next) {});
router.get('/login', function(req, res, next) {});

router.get('/details', function(req, res, next) {}); //get
router.post('/details', function(req, res, next) {}); //changing

router.delete('/delete', function(req, res, next) {});

module.exports = router;
