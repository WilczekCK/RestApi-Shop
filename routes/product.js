var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.status(200).end()
});

router.post('/', function(req, res, next) {
    res.status(200).end()
});

router.delete('/', function(req, res, next) {
    res.status(200).end()
});

router.patch('/details', function(req, res, next) {
    //route to change details
    res.status(200).end()
});

router.get('/:url_name', function(req, res, next) {
    //urlname from db
    res.status(200).end()
});


module.exports = router;
