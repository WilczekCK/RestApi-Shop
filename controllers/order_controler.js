var order_controler = order_controler || {}
order_controler = {
    onlinePayment:{
        preparePayment: () => {},
        setPaid: () => {}
    },
    createOrder: () => {
        var products = product_controler.checkProducts(id);
        var price = online_controler.sumPrice();

        //dosmth

        product_controler.setStatus(id);
    },
    removeOrder: () => {

    },
    changeAmount: () => {

    },
    sumPrice: () => {

    },
    setStatus: (status) => {
        
    }
}


module.exports = order_controler || 'Order Controler Problem!';