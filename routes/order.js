var express = require('express');
var router = express.Router();
var order = require('../controllers/order_controler.js');

router.get('/all', async function(req, res, next) {
    const getOrder = await order.display.all(req.body);
    res.status(getOrder.status).send(getOrder);
});

router.get('/user', async function(req, res, next) {
    const getOrder = await order.display.fromUser(req.body);
    res.status(getOrder.status).send(getOrder);
});

router.get('/single', async function(req, res, next) {
    const getOrder = await order.display.single(req.body);
    res.status(getOrder.status).send(getOrder);
});

router.get('/history', async function(req, res, next) {
    //It's like a cart ;)
    const getOrder = await order.display.single(req.body);
    res.status(getOrder.status).send(getOrder);
});

router.patch('/modify', async function(req, res, next) {
    const modifyResponse = await order.setStatus(req.body);
    res.status(modifyResponse.status).send(modifyResponse);
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
