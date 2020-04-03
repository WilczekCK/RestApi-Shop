var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
    res.status(200).end()
});

router.post('/login', function(req, res, next) {
    res.status(200).end()
});

router.get('/register', function(req, res, next) {
    res.status(200).end()
});

router.post('/register', function(req, res, next) {
    res.status(200).end()
});

router.post('/delete', function(req, res, next) {
    res.status(200).end()
});


module.exports = router;
