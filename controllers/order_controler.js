var mysql = require('./mysql_controler');
var _ = require('underscore');

var order_controler = order_controler || {}
order_controler = {
    onlinePayment: {
        preparePayment: () => { },
        setPaid: () => { }
    },
    createOrder: async ({ customerId, productsOrdered }) => {
        if (!customerId || !productsOrdered) return { status: 400, message: 'You are missing one of the parameters' };
        const summaryPrice = await order_controler.sumPrice(productsOrdered);

        return { status: summaryPrice.status, customerId: customerId, productsOrdered: productsOrdered, summaryPrice: summaryPrice.message };
    },
    removeOrder: () => {

    },
    changeAmount: () => {

    },
    prepareArray: async (productsOrdered) => {
        try {
            const productsInfo = await mysql.showCertain('products', 'price', `id IN (${_.pluck(productsOrdered, 'productId')})`)
            let products = {
                idArray: _.pluck(productsOrdered, 'productId'),
                amountArray: _.pluck(productsOrdered, 'amount'),
                priceArray: _.pluck(productsInfo, 'price'),
                priceSummary: 0
            };

            return products;
        } catch (error) {
            return { status: 406, message: 'Error while creating table for summary' }
        }
    },
    sumPrice: async (productsOrdered) => {
        try {
            const products = await order_controler.prepareArray(productsOrdered);
            console.log(products)
            //return { status: 200, message: { withoutVat: priceSummary, withVat: ((priceSummary) * 1.23) } };
        } catch (error) {
            //return { status: 406, message: 'Error while summary of products!' }
        }
    },
    setStatus: (status) => {

    }
}


module.exports = order_controler || 'Order Controler Problem!';