var express = require('express');
var router = express.Router();
var product = require('../controllers/product_controler.js');

router.get('/', async function(req, res, next) {
    const allProducts = await product.showAll();
    res.send(allProducts)
});

router.post('/', function(req, res, next) {
    const isNewProductAdded = product.addProduct(req.body);
    res.status(isNewProductAdded.status).send(isNewProductAdded);
});

router.delete('/', async function(req, res, next) {
    const isProductRemoved = await product.removeProduct(req.body);
    res.send(isProductRemoved);
});

router.patch('/details', async function(req, res, next) {
    const isProductDetailChanged = await product.changeDetails(req.body);
    res.send(isProductDetailChanged);
});

router.get('/:url_name', async function(req, res, next) {
    const detailedProduct = await product.showDetails(req.params.url_name);
    res.send(detailedProduct);
});


module.exports = router;
