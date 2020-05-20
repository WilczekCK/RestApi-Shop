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
        all: async ({ limit }) => {
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
        single: async ({ order_id }) => {
            if (!order_id) return { status: 406, message: 'You are missing one of the parameters' };

            const orderRecords = await mysql.showCertain('orders, order_detail', 'orders.*, order_detail.*', `orders.id = ${order_id} AND order_detail.order_id = ${order_id} ORDER BY orders.date DESC`);
            if(!orderRecords.length) return {status: 404, message: 'Order not found in db'};

            const shuffledRecords = await order_controler.createProductsArrayFromOrder(orderRecords);
            return { status: 200, orders: shuffledRecords }
        },
    },
    createOrder: async ({ customerId, productsOrdered }) => {
        if (!customerId || !productsOrdered) return { status: 400, message: 'You are missing one of the parameters' }
        const summaryPrice = await order_controler.sumPrice(productsOrdered);

        let orderDetails = {
            status: summaryPrice.status,
            orderId: 0,
            customerId: customerId,
            productsOrdered: productsOrdered,
            summaryPrice: summaryPrice.message
        }

        await mysql.insert('orders',
            'user_id, date, status',
            `${customerId}, '${moment().format("YYYY-MM-DD HH:mm:ss")}', 0`)
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
    removeOrder: async ({ customerId, orderId }) => {
        if (!customerId || !orderId) return { status: 406, message: 'You are missing one of the parameters' };

        const orderDetails = await mysql.showCertain('orders', '*', `user_id = '${customerId}' AND id = '${orderId}'`)
        if (_.isEmpty(orderDetails)) return { status: 400, message: 'There is no order like that' };
        else {
            mysql.delete('orders', orderDetails[0].id)
            mysql.query(`DELETE FROM order_detail WHERE order_id = ${orderDetails[0].id}`)
            return { status: 200, message: 'You removed the order successfully!' }
        }
    },
    getUserOrderSummaries: async (orders) => {
        const productsOrdered = []; 

        _.each(_.uniq(_.pluck(orders, 'id')), order_id => {
            productsOrdered.push({order_id: order_id, products: []})
        })

        orders.forEach(order => {
            let getOrderIdPosition = _.indexOf(_.pluck(productsOrdered, 'order_id'), order.id);
            productsOrdered[getOrderIdPosition].products.push({
                product_id: order.product_id,
                amount: order.amount
            })
        })
    },
    createProductsArrayFromOrder: async (orders) => {
        const productsOrdered = []; 

        _.each(_.uniq(_.pluck(orders, 'id')), order_id => {
            productsOrdered.push({order_id: order_id, products: []})
        })

        orders.forEach(order => {
            let getOrderIdPosition = _.indexOf(_.pluck(productsOrdered, 'order_id'), order.id);
            productsOrdered[getOrderIdPosition].products.push({
                product_id: order.product_id,
                amount: order.amount
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
    setStatus: async ({ status, id, user_id }) => {
        if (!status || !id || !user_id) return { status: 406, message: 'You are missing one of the parameters!' }

        const response = await mysql.update('orders', `status = ${status}`, `id = ${id} AND user_id = ${user_id}`);
        if (response) return { status: 200, message: 'You changed the order successfully!' }
        else return { status: 406, message: 'Error while setting status!' }
    }
}


module.exports = order_controler || 'Order Controler Problem!';