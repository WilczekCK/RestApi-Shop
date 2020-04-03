var mysql = require('./mysql_controler');

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
    }
}   


module.exports = product_controler || 'Product Controler Problem!';