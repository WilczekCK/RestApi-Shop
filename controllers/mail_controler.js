var mysql = require('./mysql_controler');
var nodemailer = require('nodemailer');
var _ = require('underscore');
var profile = require('./profile_controler');
var product = require('./product_controler');

var mail_controler = mail_controler || {}
mail_controler = {
    transporter: nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth:{
            user:'c453680365e19b',
            pass: 'b0dc723f60997f',
        }
    }),
    send: async (deliverTo, subject, text, html) => {
        try{
            const callback = await mail_controler.transporter.sendMail({
                from: 'Bryan - Your shop assistent <noreply@z-dowozem.com> |',
                to: deliverTo,
                subject: subject,
                text: text,
                html: html
            })

            if(callback) return {
                acceptedMails: callback.accepted,
                rejectedMails: callback.rejected
            }
        }catch{
            return new Error('There is a problem with sending the mail!')
        }
    },
    schema:{
        newAccount: async (status, accInfo) => {
            if(status !== 200){
                console.log('Mail not send! - 200 status not reached!')
                return 0;
            }else{
                await mail_controler.send(accInfo.email, 
                    'Z dowozem || Account created!',
                    `Hello ${accInfo.name} Something bla bla bla`,
                    `<b>${accInfo.name}</b> your account is created!`
                )
            }
        },
        newOrderLogged: async (status, products, userId) => {
            if(status !== 200){
                console.log('Mail not send! - 200 status not reached!')
                return 0;
            }else{
                const [{email, name}] = await profile.lookForProfile(`id = ${userId}`);
                const detailedProductInfo = [];

                for await (item of products){
                    const [{name, price}] = await product.showDetailsId(item.productId);
                    detailedProductInfo.push({productName:name, amount: item.amount, price: price})
                }



                await mail_controler.send(email, 
                    'Z dowozem || Order created!',
                    `Hello ${name} Something bla bla bla`,
                    `<b>${name}</b> your order is created!<br>
                    You ordered:<br>`
                )
            }
        },
        newOrderNotLogged: async (status, products, userInfo) => {
            if(status !== 200){
                console.log('Mail not send! - 200 status not reached!')
                return 0;
            }else{
                const detailedProductInfo = [];
                for await (item of products){
                    const [{name, price}] = await product.showDetailsId(item.productId);
                    detailedProductInfo.push({productName:name, amount: item.amount, price: price})
                }

                await mail_controler.send(userInfo.email, 
                    'Z dowozem || Order created! - Guest',
                    `Hello ${userInfo.firstName} Something bla bla bla`,
                    `<b>${userInfo.firstName}</b> your order is created!<br>
                    You ordered:<br>`
                )
            }
        }
    }
}


mail_controler.transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take messages');
    }
  });


module.exports = mail_controler || 'Mail Controler Problem!';