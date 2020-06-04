var mysql = require('./mysql_controler');
var nodemailer = require('nodemailer');
var _ = require('underscore');

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

            if(callback.accepted) return {status: 'success'}
            else if(callback.rejected) return {status: 'deny'}
            else return {status: undefined}
        }catch{
            return new Error('There is a problem with sending the mail!')
        }

    }
}


module.exports = mail_controler || 'Mail Controler Problem!';