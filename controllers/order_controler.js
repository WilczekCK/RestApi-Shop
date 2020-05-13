var mysql = require('./mysql_controler');

var order_controler = order_controler || {}
order_controler = {
    onlinePayment:{
        preparePayment: () => {},
        setPaid: () => {}
    },
    createOrder: ({customerId, productsOrdered}) => {
        if(!customerId || !productsOrdered) return {status: 400, message:'You are missing one of the parameters'};
        const summaryPrice = order_controler.sumPrice(productsOrdered);
        return {customerId: customerId, productsOrdered: productsOrdered, summaryPrice: summaryPrice};
    },
    removeOrder: () => {

    },
    changeAmount: () => {

    },
    sumPrice: async (productsOrdered) => {
        const productsInfo = await mysql.showCertain('products', 'price, name, vat_percentage', `id IN (${productsOrdered})`)
    },
    setStatus: (status) => {
        
    }
}


module.exports = order_controler || 'Order Controler Problem!';