var mysql = require('./mysql_controler');
var _ = require('underscore');
var product_controler = product_controler || {}
product_controler = {
    addToCart: () => {
        
    },
    removeFromCart: () => {

    },
    showAll: async () => {
        return await mysql.show('products', '*');
    },
    showDetails: async (condition) => {
        return await mysql.showCertain('products', '*' ,`url_name = "${condition}"`);
    },
    addProduct: (incomingInfo) => {
        const productIncoming = [
            incomingInfo.name,
            incomingInfo.weight,
            incomingInfo.price,
            incomingInfo.photo,
            incomingInfo.category,
            incomingInfo.nutritional_table,
            incomingInfo.vat_percentage,
            incomingInfo.url_name
        ]

        const areFieldsFilled = _.every(productIncoming, function (productInfo) {return productInfo != null});
        if(areFieldsFilled) {
            const preparedStrings = []; 
            _.each(productIncoming, (value) => {
                preparedStrings.push(`'${value}'`)
            });

            mysql.insert('products', 'name, weight, price, photo, category, nutritional_table, vat_percentage, url_name', `${preparedStrings}`);
            return `You successfuly added the product named ${incomingInfo.name}!`
        } else{
            return 'One or more fields are missing!'
        }
    },
}   


module.exports = product_controler || 'Product Controler Problem!';