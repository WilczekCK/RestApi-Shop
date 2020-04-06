var express = require('express');
var router = express.Router();
var product = require('../controllers/product_controler.js');

router.get('/', async function(req, res, next) {
    const allProducts = await product.showAll();
    res.send(allProducts)
});

router.post('/', function(req, res, next) {
    const response = product.addProduct(req.body);
    res.send(response)
});

router.delete('/', function(req, res, next) {
    const response = product.removeProduct
    res.status(200).end()
});

router.patch('/details', function(req, res, next) {
    //route to change details
    res.status(200).end()
});

router.get('/:url_name', async function(req, res, next) {
    const detailedProduct = await product.showDetails(req.params.url_name);
    res.send(detailedProduct);
});


module.exports = router;
