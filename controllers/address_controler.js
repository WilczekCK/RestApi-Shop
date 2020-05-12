var mysql = require('./mysql_controler');
var _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./../config/jwtSecret')

var address_controler = address_controler || {}
address_controler = {

    addAddress: async ({ address, post_code, city, userId }) => {
        // const alreadyAdress = await address_controler.showAll( {adress, userId} );
        console.log(userId);
        console.log(address);
        // if (alreadyAdress.length) {
            // return { status: 409, message: 'Address already exists!' }
        // } else {
            if ( address || post_code || city || userId ) {
                mysql.insert('addresses',
                    'address, post_code, city, user_id',
                    `'${address}', '${post_code}', '${city}', '${userId}'`
                )

                return { status: 200, message: 'Address added succesfully!' };
            } else {
                return { status: 400, message: 'You are missing one of the parameters' }
            }
        // }
    },
    removeAddress: async ({ id, userId }) => {
        if (!id) return { status: 406, message: 'Provide the ID of an adress you want to remove!' };
        const isAddressInDb = await mysql.showCertain('addresses', '*', `id = ${id}`);

        if (!_.isEmpty(isAddressInDb)) {
            await mysql.deleteWithAuth( 'addresses', {id: id, userId: userId} );
            return { status: 200, message: 'You successfully removed this address!' };
        } else {
            return { status: 404, message: 'User not found in db' };
        }
    },
    changeInfo: async ({ id, userId, rowsToChange }) => {
        if (!id || !rowsToChange) return { status: 400, message: 'You are missing one of the parameters' }
        const isUserInDb = await mysql.showCertain( 'addresses', '*', `id = ${id}, userId = ${userId}`);

        if (!_.isEmpty(isUserInDb)) {
            await mysql.update('users', rowsToChange, `id = ${id}, userId = ${userId}`);
            return { status: 200, message: 'You successfully changed info of this user!' };
        } else {
            return { status: 404, message: 'User not found in db' };
        }
    },
    lookForAddress: async ( { id, userId } ) => {
        const info = await mysql.showCertain('addresses', '*', `id = ${id}, userId = ${userId}`);
        return info;
    },
    showAll: async ( {userId} ) => await mysql.showCertain('addresses', '*', `userId = ${userId}`),
}

module.exports = address_controler || 'Profile Controler Problem!';