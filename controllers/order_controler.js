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
            let products = {
                idArray: [],
                amountArray: [],
                priceArray: [],
                priceSummary: 0
            };

            _.each(productsOrdered, async ({productId, amount}) => {
                products.idArray.push(productId);
                products.amountArray.push(amount);
            })

            const productsInfo = await mysql.showCertain('products', 'price', `id IN (${products.idArray})`)
            _.each(productsInfo, async ({price}) => products.priceArray.push(price));

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