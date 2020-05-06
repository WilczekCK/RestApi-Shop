var express = require('express');
var router = express.Router();
var address = require('../controllers/address_controler.js');

router.get('/', async function(req, res, next) {
    const allAddresses = await address.showAll( req.body );
    res.send(allAddresses)
});

router.post('/', function(req, res, next) {
    const isNewAddressAdded = address.addAddress( req.body );
    res.status(isNewAddressAdded.status).send(isNewAddressAdded);
});

router.delete('/', async function(req, res, next) {
    const isAddressRemoved = await address.removeAddress(req.body);
    res.status(isAddressRemoved.status).send(isAddressRemoved);
});

router.patch('/details', async function(req, res, next) {
    const isAddressDetailChanged = await address.changeDetails(req.body);
    res.status(isAddressDetailChanged).send(isAddressDetailChanged);
});

router.get('/:url_name', async function(req, res, next) {
    const detailedAddress = await address.showDetails(req.params.url_name);
    res.send(detailedAddress);
});


module.exports = router;
