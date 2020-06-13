var express = require('express');
var router = express.Router();
var payment = require('../controllers/payment_controler.js');


router.post('/sendorder', function(req, res){
    payment.createOrder(req, res).then( info => {
        res.status(200).send( info )
    },  
    (err) => { 
        console.log("err");
        res.status(500).send({msg: 'Nie udało się ukończyć płatności'})
    } ) 
})

// requests from payu
router.post('/info', function(req, res){
    const correctionInfo = payment.handleInfoFromPayu(req)
    res.status( correctionInfo.status ).send( correctionInfo.message );
})

module.exports = router;