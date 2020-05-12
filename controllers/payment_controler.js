var request = require("request");
var axios = require('axios');


var payment_controler = payment_controler || {}
payment_controler = {

  getToken: () => {

      const url = 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize?grant_type=client_credentials&client_id=386221&client_secret=b7f9cadd7c9fdb3d73c9ea02a23287ac';
      return axios.post( url );

  },
  
  sendOrder: (token, req, res) => {
    return new Promise( (resolve, reject) => {

      request({
        method: 'POST',
        url: 'https://secure.snd.payu.com/api/v2_1/orders',
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {  
          notifyUrl: "http://api2.antykstyl.usermd.net/payment/info", 
          customerIp: "127.0.0.1",  
          merchantPosId: "386221", 
          totalAmount: req.body.price * 100,
          description: "Zdowozem.pl",   
          currencyCode : "PLN",
          products : payment_controler.transformCartPayu(req.body.cart),
          // buyer : {
              // email : req.body.email ,
          // }
          //   phone : "654111654",
          //   firstName : "John",
          //   lastName : "Doe",
          //   language : "en"
          // },
        },
  
      }, 
      (error, response, body) => {
        if(error) res.status(500).send({success: false})
        resolve( body );
        reject( error );
      });

    })
  },

  createOrder: async( req, res ) => {
    
    console.log(req.body.price * 100)
    console.log(payment_controler.transformCartPayu(req.body.cart))

    return payment_controler.getToken()
    .then( ( tokenResponse ) => {
      const token = tokenResponse.data.access_token;
      return payment_controler.sendOrder(token, req, res);
    })
    
  },

  transformCartPayu: ( cart ) => {
    
    return cart.map( prod => {
      return{
        name: prod.name,
        unitPrice: +prod.price,
        quantity: prod.amount
      }
      
    })

  //         {
  //           name : "Wireless Mouse for Laptop",
  //           unitPrice : 15000,
  //           quantity :  1 
  //         },

  }



}

module.exports = payment_controler || 'Profile Controler Problem!';