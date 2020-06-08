var mysql = require('./mysql_controler');
var _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./../config/jwtSecret')

var profile_controler = profile_controler || {}
profile_controler = {
    
    addTemporaryUser: async ({ firstName, secondName, email, phone }) => {
        let response;
        if (!firstName || !secondName || !email || !phone ) {
            return { status: 400, message: 'You are missing one of the user parameters' }
        }
        else {
            await mysql.insert('users',
                'name, surname, email, password, phone',
                `'${firstName}', '${secondName}', '${email}', '', ${phone}`
            ).then( ( userResponse ) => {
                response = userResponse;
            } )
        }
        return { status: 200, message: 'You are registered succesfully!', rows: response };
    },
    addNew: async ({ firstName, secondName, email, password, phone, street, city, postCode }) => {
        let addressResponse, profileResponse;
        const isRegistered = await profile_controler.lookForProfile(`email = '${email}'`);
        if (isRegistered.length) {
            return { status: 409, message: 'Account with that email is already registered!' }
        } else {
            if (!firstName || !secondName || !email || !password || !phone || !street || !city || !postCode) {
                return { status: 400, message: 'You are missing one of the parameters' }
            } else {

                await mysql.insert('users',
                    'name, surname, email, password, phone',
                    `'${firstName}', '${secondName}', '${email}', '${bcrypt.hashSync(password, 10)}', ${phone}`
                ).then( ( userResponse ) => {
                profileResponse = userResponse;

                return mysql.insert('addresses', 
                    'city, address, post_code, user_id',
                    `'${city}', '${street}', '${postCode}', ${userResponse.insertId}`)
                }).then( ( addressRes ) => {
                    addressResponse = addressRes;
                    mysql.update('users', 
                        `default_address = ${addressResponse.insertId}`, 
                        `email = "${email}"`
                    )    
                })
                return { status: 200, message: 'You are registered succesfully!', rows:{ profileResponse, addressResponse }, accInfo: {name: firstName, email: email}  };

            }
        }
    },
    remove: async ({ id }) => {
        if (!id) return { status: 406, message: 'Provide the ID of a profile you want to remove!' };
        const isUserInDb = await mysql.showCertain('users', '*', `id = ${id}`);

        if (!_.isEmpty(isUserInDb)) {
            await mysql.delete('users', id)
            return { status: 200, message: 'You successfully removed this user!' };
        } else {
            return { status: 404, message: 'User not found in db' };
        }
    },
    changeInfo: async ({ rowsToChange }, id) => {
        if (!id || !rowsToChange) return { status: 400, message: 'You are missing one of the parameters' }
        const isUserInDb = await mysql.showCertain('users', '*', `id = ${id}`);

        if (!_.isEmpty(isUserInDb)) {
            await mysql.update('users', rowsToChange, `id = ${id}`);
            return { status: 200, message: 'You successfully changed info of this user!' };
        } else {
            return { status: 404, message: 'User not found in db' };
        }
    },
    lookForProfile: async (condition) => {
        const info = await mysql.showCertain('users', '*', `${condition}`);
        return info;
    },
    lookForProfileNoPass: async (condition) => {
        const info = await mysql.showCertain('users', 'email, phone, name, surname, default_address', `${condition}`);
        return info;
    }
}


module.exports = profile_controler || 'Profile Controler Problem!';