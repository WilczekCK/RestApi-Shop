var mysql = require('./mysql_controler');
var _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./../config/jwtSecret')

var address_controler = address_controler || {}
address_controler = {

    addAddress: async ({ address, postCode, city, userId }) => {

            if ( !address || !postCode || !city || !userId ) {
                return { status: 400, message: 'You are missing one of the parameters' }
            } 
            else {
                const rows = await mysql.insert('addresses',
                    'address, post_code, city, user_id',
                    `'${address}', '${postCode}', '${city}', '${userId}'`
                )
                return { status: 200, message: 'Address added succesfully!', rows: rows };
            }
        // }
    },
    removeAddress: async ({ id, userId }) => {

        if (!id) return { status: 406, message: 'Provide the ID of an adress you want to remove!' };
        // const isAddressInDb = await mysql.showCertain('addresses', '*', `id = ${id}`);

        // if (!_.isEmpty(isAddressInDb)) {
        const rows = await mysql.deleteWithAuth( 'addresses', {id: id, userId: userId} );
        return { status: 200, message: 'You successfully removed this address!', rows };
        // } else {
        //     return { status: 404, message: 'User not found in db' };
        // }
    },
    changeDetails: async ({ id, userId, rowsToChange }) => {
        if (!id || !rowsToChange) return { status: 400, message: 'You are missing one of the parameters' }
        // const isUserInDb = await mysql.showCertain( 'addresses', '*', `id = ${id}, userId = ${userId}`);

        const rows = await mysql.update('addresses', rowsToChange, `id = ${id} AND user_id = ${userId}`);
        if( rows.affectedRows)
            return { status: 200, message: 'You successfully changed info of this address!', rows };
        else
            return { status: 401, message: 'Address not changed!', rows };

    },
    lookForAddress: async ( { id, userId } ) => {
        const rows = await mysql.showCertain('addresses', '*', `id = ${id} AND user_id = ${userId}`);
        if( rows.length > 0 )
            return { status: 200, message: 'Success', rows };
        else
            return { status: 404, message: 'There is no addres with that id', rows };
    },
    showAll: async ( {userId} ) => {
        const rows = await mysql.showCertain('addresses', '*', `user_id = ${userId}`)
        if( rows.length > 0 )
            return { status: 200, message: 'You successfully got rows', rows }
        else 
            return { status: 404, message: 'There is no addresses that match this query'}
        },
}

module.exports = address_controler || 'Profile Controler Problem!';