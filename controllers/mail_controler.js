var mysql = require('./mysql_controler');
var nodemailer = require('nodemailer');
var _ = require('underscore');
var createMail = require('../mail_content/create_body')
var profile = require('./profile_controler');
var product = require('./product_controler');

var mail_controler = mail_controler || {}
mail_controler = {
    attachmentConfig: [{
        filename: 'logo.png',
        path: __dirname+'/../mail_content/logo.png',
        cid: 'logo' //same cid value as in the html img src
    }],
    transporter: nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth:{
            user:'c453680365e19b',
            pass: 'b0dc723f60997f',
        }
    }),
    send: async (deliverTo, subject, text, html, attachments) => {
        try{
            const callback = await mail_controler.transporter.sendMail({
                from: 'Z-Dowozem.com <info@z-dowozem.com>',
                to: deliverTo,
                subject: subject,
                text: text,
                html: html,
                attachments: attachments,
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
                const emailResponse = await mail_controler.send(accInfo.email, 
                    'Założyłeś konto na Z-Dowozem.com!',
                    createMail.account_plain(accInfo.name),
                    createMail.account(accInfo.name),
                    mail_controler.attachmentConfig,
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

                const emailResponse = await mail_controler.send(email, 
                    'Złożyłeś zamówienie na Z-Dowozem.com!',
                    createMail.order_plain(detailedProductInfo, name),
                    createMail.order(detailedProductInfo, name),
                    mail_controler.attachmentConfig,
                )
            }
        },
        newOrderNotLogged: async (status, products, userId) => {
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

                const emailResponse = await mail_controler.send(email, 
                    'Z dowozem || Order created! - Guest',
                    createMail.order_plain(detailedProductInfo, name),
                    createMail.order(detailedProductInfo, name),
                    mail_controler.attachmentConfig,

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