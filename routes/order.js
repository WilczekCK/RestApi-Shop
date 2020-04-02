var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    //summary or certain if id provided
    res.status(200).end()
});


router.patch('/', function(req, res, next) {
    //id provided to change smth
    res.status(200).end()
});

router.delete('/remove', function(req, res, next) {
    res.status(200).end()
});

router.post('/create', function(req, res, next) {
    res.status(200).end()
});

module.exports = router;
