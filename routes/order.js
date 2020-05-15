var express = require('express');
var router = express.Router();
var order = require('../controllers/order_controler.js');

router.get('/', async function(req, res, next) {
    const allOrders = await order.display.all();
    res.status(allOrders.status).send(allOrders);
});

router.patch('/', function(req, res, next) {
    //id provided to change smth
    res.status(200).end()
});

router.delete('/remove', async function(req, res, next) {
    const removeResponse = await order.removeOrder(req.body);
    res.status(removeResponse.status).send(removeResponse);
});

router.post('/create', async function(req, res, next) {
    const orderResponse = await order.createOrder(req.body);
    res.status(orderResponse.status).send(orderResponse);
});

module.exports = router;
