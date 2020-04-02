var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.status(200).end()
});

router.get('/callback', function(req, res, next) {
    res.status(200).end()
});

router.get('/callback/success', function(req, res, next) {
    res.status(200).end()
});

router.get('/callback/failed', function(req, res, next) {
    res.status(200).end()
});


module.exports = router;
