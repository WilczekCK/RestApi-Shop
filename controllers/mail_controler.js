var mysql = require('./mysql_controler');
var nodemailer = require('nodemailer');
var _ = require('underscore');


var mail_controler = mail_controler || {}
mail_controler = {
    config:{
            host: 'smtp.mailtrap.io',
            port: 465,
            secure: true,
            auth:{
                user:'c453680365e19b',
                pass: 'b0dc723f60997f',
            }
    },
    transporter: () => nodemailer.createTransport(mail_controler.config),
    send: async (deliverTo, subject, text, html) => {
        await transporter
    }
}


module.exports = mail_controler || 'Mail Controler Problem!';