var express = require('express');
var router = express.Router();
var address = require('../controllers/address_controler.js');
var auth = require('../controllers/auth_controler.js');

let userId;

router.all('*', async function(req, res, next){
    await auth.authenticate(req, res).then( async(userID)=> {
        userId = userID;
    }, err => console.log(err) )
    next();
})

router.get('/', async function(req, res, next) {
    const allAddresses = await address.showAll( {userId:userId} );
    res.send(allAddresses)
});

router.post('/', async (req, res, next) => {
        const isNewAddressAdded = await address.addAddress( req.body, userId );
        res.status(isNewAddressAdded.status).send(isNewAddressAdded);
});

router.patch('/details', async function(req, res, next) {
    const isAddressDetailChanged = await address.changeDetails( req.body, userId );
    res.status(isAddressDetailChanged.status).send(isAddressDetailChanged);
});

router.get('/:addressId', async function(req, res, next) {
    const detailedAddress = await address.lookForAddress( { id: req.params.addressId, userId } );
    res.status(detailedAddress.status).send(detailedAddress);
});

router.delete('/delete', async function(req, res, next) {
    const isAddressRemoved = await address.removeAddress( req.body, userId );
    res.status(isAddressRemoved.status).send(isAddressRemoved);
});

module.exports = router;
