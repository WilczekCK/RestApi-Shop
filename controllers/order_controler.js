var mysql = require('./mysql_controler');
var _ = require('underscore');
var moment = require('moment');

var order_controler = order_controler || {}
order_controler = {
    onlinePayment: {
        preparePayment: () => { },
        setPaid: () => { }
    },
    display: {
        allOrders: async ({ limit }) => {
            if (_.isNumber(limit)) limit = `LIMIT ${limit}`
            else limit = '';

            const orderRecords = await mysql.show(`orders, order_detail ORDER BY orders.date DESC ${limit}`, `orders.*, order_detail.*`);
            return { status: 200, orders: orderRecords }
        },
        fromUser: async ({ user_id, limit }) => {
            if (!user_id) return { status: 406, message: 'You are missing one of the parameters' };
            if (_.isNumber(limit)) limit = `LIMIT ${limit}`
            else limit = '';

            const orderRecords = await mysql.showCertain('orders, order_detail', 'orders.*, order_detail.*', `orders.user_id = ${user_id} AND orders.id = order_detail.order_id ORDER BY orders.date DESC ${limit}`);
            if(!orderRecords.length) return {status: 404, message: 'User not found in db'};

            const shuffledRecords = await order_controler.createProductsArrayFromOrder(orderRecords);

            return { status: 200, orders: shuffledRecords }
        },
        singleOrder: async ({ order_id }) => {
            if (!order_id) return { status: 406, message: 'You are missing one of the parameters' };

            const orderRecords = await mysql.showCertain('orders, order_detail', 'orders.*, order_detail.*', `orders.id = ${order_id} AND order_detail.order_id = ${order_id} ORDER BY orders.date DESC`);

            if(!orderRecords.length) return {status: 404, message: 'Order not found in db'};
            const shuffledRecords = await order_controler.createProductsArrayFromOrder(orderRecords);
            return { status: 200, orders: shuffledRecords, orderRecords }
        },
        multiplyOrder: async ({ order_ids }) => {
            if (!order_ids) return { status: 406, message: 'You are missing one of the parameters' };
            const orderArray = [];

            for await (order of order_ids){
                const orderRecords = await mysql.showCertain('orders, order_detail', 'orders.*, order_detail.*', `orders.id = ${order} AND order_detail.order_id = ${order} ORDER BY orders.date DESC`);
                if(!orderRecords.length) return {status: 404, message: `Order with ID ${order} not found in db`};

                const shuffledRecords = await order_controler.createProductsArrayFromOrder(orderRecords);
                orderArray.push(shuffledRecords);
            }
            
            return { status: 200, orders: _.flatten(orderArray) }
        },
        fromUserSummary: async ({ limit },  user_id) => {
            if (!user_id) return { status: 406, message: 'You are missing one of the parameters' };
            if (_.isNumber(limit)) limit = `LIMIT ${limit}`
            else limit = '';

            const orderRecords = await mysql.showCertain('orders, order_detail, products','orders.*, order_detail.*, products.price',`orders.user_id = ${user_id} AND orders.id = order_detail.order_id AND order_detail.product_id = products.id ORDER BY orders.date DESC ${limit}`);
            if(!orderRecords.length) return {status: 200, message: 'Order not found in db', orders: []};

            const shuffledRecords = await order_controler.getUserOrderSummaries(orderRecords);

            return { status: 200, orders: shuffledRecords }
        },
        
    },
    createOrder: async ({ productsOrdered, address, payment }, customerId) => {
        if (!customerId || !productsOrdered || !address || !payment) return { status: 400, message: 'You are missing one of the parameters' }
        const summaryPrice = await order_controler.sumPrice(productsOrdered);
        const paymentStatus = payment == "cash-on-delivery" ? 1 : 0;
        let orderDetails = {
            status: summaryPrice.status,
            orderId: 0,// ?
            customerId: customerId,
            productsOrdered: productsOrdered,
            summaryPrice: summaryPrice.message,
            paymentMethod: paymentStatus
        }

        await mysql.insert('orders',
            'user_id, date, status, address_id',
            `${customerId}, '${moment().format("YYYY-MM-DD HH:mm:ss")}', ${paymentStatus}, ${address}`)
            .then(({ insertId }) => {
                productsOrdered.forEach(product => {
                    mysql.insert('order_detail',
                        'order_id, product_id, amount',
                        `${insertId}, ${product.productId}, ${product.amount}`)
                })

                orderDetails.orderId = insertId;
            })

        return orderDetails;
    },
    removeOrder: async ({ orderId }, customerId) => {
        if (!customerId || !orderId) return { status: 406, message: 'You are missing one of the parameters' };

        const orderDetails = await mysql.showCertain('orders', '*', `user_id=${customerId} AND id=${orderId}`)
        if (_.isEmpty(orderDetails)) return { status: 400, message: 'There is no order like that' };
        else {
            let orderResponse = await mysql.delete('orders', orderId)
            mysql.query(`DELETE FROM order_detail WHERE order_id = ${orderDetails[0].id}`)
            return { status: 200, message: 'You removed the order successfully!', rows: orderResponse }
        }
    },
    getUserOrderSummaries: async (orders) => {
        const productsOrdered = []; 

        _.each(_.uniq(_.pluck(orders, 'id')), order_id => {
            productsOrdered.push({
                orderId: order_id,
                date: '',
                price: 0,
                amountOfProducts: 0,
                status: 0
            })
        })
        
        orders.forEach(order => {
            let getOrderIdPosition = _.indexOf(_.pluck(productsOrdered, 'orderId'), order.id);
            //it's an array with objects, that's why we need ID to target it
                productsOrdered[getOrderIdPosition].date = moment(order.date).format("YYYY-MM-DD HH:mm:ss");
                productsOrdered[getOrderIdPosition].price += (order.price) * order.amount;
                productsOrdered[getOrderIdPosition].amountOfProducts += 1;
                productsOrdered[getOrderIdPosition].status = order.status;
        })

        
        return productsOrdered;
    },
    createProductsArrayFromOrder: async (orders) => {
        console.log("orders 1");
        console.log(orders);
        
        const productsOrdered = []; 
        _.each(_.uniq(_.pluck(orders, 'id')), order_id => {
            productsOrdered.push({order_id: order_id, status: orders[0].status, date: moment(orders[0].date).format("YYYY-MM-DD HH:mm:ss"), products: []})
        })

        orders.forEach(order => {
            let getOrderIdPosition = _.indexOf(_.pluck(productsOrdered, 'order_id'), order.id);
            //it's an array with objects, that's why we need ID to target it

            productsOrdered[getOrderIdPosition].products.push({
                product_id: order.product_id,
                amount: order.amount,
            })
        })

        return productsOrdered;
    },
    prepareOrderArray: async (productsOrdered) => {
        try {
            const productsInfo = await mysql.showCertain('products', 'price', `id IN (${_.pluck(productsOrdered, 'productId')})`)
            let products = {
                idArray: _.pluck(productsOrdered, 'productId'),
                amountArray: _.pluck(productsOrdered, 'amount'),
                priceArray: _.pluck(productsInfo, 'price'),
                priceSummary: 0
            };

            if (_.contains(products.idArray, undefined)
                || _.contains(products.amountArray, undefined)
                || _.contains(products.priceArray, undefined))
                return { status: 406, message: 'You are missing one of the parameters' };

            return products;
        } catch (error) {
            return { status: 406, message: 'Error while creating table for summary' }
        }
    },
    sumPrice: async (productsOrdered) => {
        try {
            const { idArray, priceArray, amountArray } = await order_controler.prepareOrderArray(productsOrdered);
            var priceSummary = 0;

            let queue = 0;
            idArray.forEach(_ => {
                priceSummary = priceSummary + (priceArray[queue] * amountArray[queue])
                queue++;
            })


            return { status: 200, message: { withoutVat: priceSummary, withVat: ((priceSummary) * 1.23) } };
        } catch (error) {
            return { status: 406, message: 'Error while summary of products!' }
        }
    },
    setStatus: async ({ status, id }) => {
        if (!status || !id) return { status: 406, message: 'You are missing one of the parameters!' }

        const response = await mysql.update('orders', `status = ${status}`, `id = ${id}`);
        if (response) return { status: 200, message: 'You changed the order successfully!' }
        else return { status: 406, message: 'Error while setting status!' }
    }
}


module.exports = order_controler || 'Order Controler Problem!';