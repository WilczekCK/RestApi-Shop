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
            console.log(accInfo)
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