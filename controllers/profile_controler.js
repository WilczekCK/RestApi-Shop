var mysql = require('./mysql_controler');
var _ = require('underscore');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

var profile_controler = profile_controler || {}
profile_controler = {
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

            console.log(collectedInfo)

            if(_.contains(collectedInfo, undefined)) return 'You are missing one of the fields!'
            else {
                mysql.insert('users', 
                    'name, surname, email, password, phone, address, city, post_code',
                    `'${collectedInfo.name}', '${collectedInfo.surname}', '${collectedInfo.email}', '${collectedInfo.password}', ${collectedInfo.phone}, '${collectedInfo.street}', '${collectedInfo.city}', '${collectedInfo.post_code}'`
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