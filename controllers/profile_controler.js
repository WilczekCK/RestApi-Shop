var mysql = require('./mysql_controler');
var _ = require('underscore');
const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken')

var profile_controler = profile_controler || {}
profile_controler = {
    login: (req, user) => {
        return new Promise((resolve, reject) =>{
            req.logIn(user, async err => {
                if(err) throw err
                let foundUser = profile_controler.lookForProfile(`email = '${user.email}'`);
                const token = jwt.sign({ id: foundUser.username }, 'jwtSecret.secret');
    
                resolve({auth: true, token: token, message: 'user logged in successfully'});
            });
        })
    },
    addNew: async (userInfo) => {
        const isRegistered = await profile_controler.lookForProfile(`email = '${userInfo.email}'`);
        if(isRegistered.length){
            return 'That account is already registered!'
        }else{
            var hashedPassword;
            if(userInfo.password !== undefined){
                hashedPassword = bcrypt.hashSync(userInfo.password, 10);
            }
        
            const collectedInfo = {
                name: userInfo.firstName,
                surname: userInfo.secondName,
                email: userInfo.email,
                password: hashedPassword,
                phone: userInfo.phone, 
                street: userInfo.street,
                city: userInfo.city,
                post_code: userInfo.postCode
            }

            if(_.contains(collectedInfo, undefined)) return 'You are missing one of the fields!'
            else {
                mysql.insert('users', 
                    'firstName, secondName, email, password, phone, city, street, postCode',
                    `'${collectedInfo.name}', '${collectedInfo.surname}', '${collectedInfo.email}', '${collectedInfo.password}', ${collectedInfo.phone}, '${collectedInfo.city}', '${collectedInfo.street}', '${collectedInfo.post_code}'`
                )

                return 'You are registered successfully!'
            }
        }
    },
    remove: () => {
        
    },
    changeInfo: () => {

    },
    lookForProfile: async (condition) => {
        const info = await mysql.showCertain('users', '*', `${condition}`);
        return info;
    }
}


module.exports = profile_controler || 'Profile Controler Problem!';