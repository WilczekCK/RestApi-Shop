var mysql = require('./mysql_controler');
var _ = require('underscore');

var order_controler = order_controler || {}
order_controler = {
    onlinePayment:{
        preparePayment: () => {},
        setPaid: () => {}
    },
    createOrder: async ({customerId, productsOrdered}) => {
        if(!customerId || !productsOrdered) return {status: 400, message:'You are missing one of the parameters'};
        const summaryPrice = await order_controler.sumPrice(productsOrdered);
        return {customerId: customerId, productsOrdered: productsOrdered, summaryPrice: summaryPrice};
    },
    removeOrder: () => {

    },
    changeAmount: () => {

    },
    sumPrice: async (productsOrdered) => {
        const productsInfo = await mysql.showCertain('products', 'price, name, vat_percentage', `id IN (${productsOrdered})`)
        let priceSummary = 0;

        _.each(productsInfo, async ({price, name, vat_percentage}) => {
            //without percentage included
            return priceSummary = priceSummary + price;
        })

        return priceSummary;
    },
    setStatus: (status) => {
        
    }
}


module.exports = order_controler || 'Order Controler Problem!';