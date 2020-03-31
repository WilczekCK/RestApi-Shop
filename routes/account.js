var express = require('express');
var router = express.Router();
var mysql = require('../controllers/mysql_controler.js');

router.get('/', function(req, res, next) {
    mysql.query();
    res.status(200).end()
});

module.exports = router;
