var express = require('express');
var router = express.Router();

<<<<<<< HEAD
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
=======
router.get('/', function(req, res, next) {
    //console.log(await mysql.query('select * from test'))
    mysql.insert('test', 'id', 1);
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

>>>>>>> parent of d7ddc8d... all routes decided to be
module.exports = router;
