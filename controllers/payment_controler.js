var request = require("request");
var axios = require('axios');
var payuConfig = require('../config/payuConfig')
var order = require('./order_controler.js');

var payment_controler = payment_controler || {}
payment_controler = {

  createOrder: async( req, res ) => {

    return payment_controler.getToken()

    .then( ( tokenResponse ) => {
      const token = tokenResponse.data.access_token;
      return payment_controler.sendOrder(token, req, res);
    })
    
  },

  changePaymentStatus: ( { status, orderId } ) => {
    mysql.update('orders', `status = `, condition)
  },

  getToken: () => {
      const url = `https://secure.snd.payu.com/pl/standard/user/oauth/authorize?grant_type=client_credentials&client_id=${payuConfig.clientId}&client_secret=${payuConfig.clientSecret}`;
      return axios.post( url );
  },
  
  sendOrder: (token, req, res) => {
    return new Promise( (resolve, reject) => {
      console.log(req.body.price);
      
      request({
        method: 'POST',
        url: 'https://secure.snd.payu.com/api/v2_1/orders',
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {  
          notifyUrl: "http://api.z-dowozem.com/payment/info", 
          customerIp: "127.0.0.1",  
          merchantPosId: `${payuConfig.clientId}`, 
          totalAmount: req.body.price * 100,
          description: "Zdowozem.pl",   
          currencyCode : "PLN",
          products : payment_controler.transformCartPayu(req.body.cart),
          extOrderId: req.body.orderId,
        },
  
      }, 
      (error, response, body) => {
        if(error) res.status(500).send({success: false})
        resolve( body );
        reject( error );
      });

    })
  },

  transformCartPayu: ( cart ) => {
    
    return cart.map( prod => {
      
      return{
        name: prod.name,
        unitPrice: Math.floor( +prod.price*100 ),
        quantity: prod.amount
      }
      
    })

  },

  handleInfoFromPayu: async ( req ) => {
    console.log(req.headers['x-openpayu-signature'].split(";")[1].slice(10));

    //check if request came from payu
    // let incomingSignature = req.headers['x-openpayu-signature'].split(";")[1].slice(10);
    // if( !incomingSignature === payuSignature ) return { status: 406, msg: "Wrong Authorization"}

    const orderId = Number(req.body.order.extOrderId);
    let status;
    if( req.body.order.status == "COMPLETED" ) status = 2
    else if( req.body.order.status == "CANCELED" ) status = 3

    let response = await order.setStatus( { status, id: orderId } )

    return response
  }

}

module.exports = payment_controler || 'Profile Controler Problem!';