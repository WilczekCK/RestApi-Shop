var express = require('express');
var router = express.Router();
var order = require('../controllers/order_controler.js');

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

router.post('/create', async function(req, res, next) {
    const orderResponse = await order.createOrder(req.body);
    res.status(200).send(orderResponse);
});

module.exports = router;
