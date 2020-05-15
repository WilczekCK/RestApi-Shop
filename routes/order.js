var express = require('express');
var router = express.Router();
var order = require('../controllers/order_controler.js');

router.get('/display/all', async function(req, res, next) {
    const getOrder = await order.display.all(req.body);
    res.status(getOrder.status).send(getOrder);
});

router.get('/display/fromUser', async function(req, res, next) {
    const getOrder = await order.display.fromUser(req.body);
    res.status(getOrder.status).send(getOrder);
});

router.get('/display/singleOrder', async function(req, res, next) {
    const getOrder = await order.display.single(req.body);
    res.status(getOrder.status).send(getOrder);
});

router.patch('/modify', function(req, res, next) {
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
