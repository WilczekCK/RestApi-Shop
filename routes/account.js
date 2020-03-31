var express = require('express');
var router = express.Router();
var mysql = require('../controllers/mysql_controler.js');

router.get('/', function(req, res, next) {
    mysql.update('test', 'id = 3', 'id = 2' );
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

module.exports = router;
