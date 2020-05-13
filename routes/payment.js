var express = require('express');
var router = express.Router();
var payment = require('../controllers/payment_controler.js');


router.post('/sendorder', function(req, res){
    
    payment.createOrder(req, res).then( info => {
        // info has order id from payu
        // order.create( id )
        res.status(200).send( info )
    }, err => res.status(500).send({msg: 'Nie udało się ukończyć płatności'}) )
    
})

// requests from payu
router.post('/info', function(req, res){
    
    // req.body.order.orderId
    // req.body.order.status
    console.log( req.body.order)
    res.status(200).send( "OK" )
})

module.exports = router;