var express = require('express');
var router = express.Router();
var mysql = require('../controllers/mysql_controler.js');

router.get('/', function(req, res, next) {
    //console.log(await mysql.query('select * from test'))
    mysql.insert('test', 'id', 1);
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

module.exports = router;
