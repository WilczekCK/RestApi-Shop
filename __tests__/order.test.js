const request = require('supertest');
const http = require('http');
const server = require('../app.js');

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});

afterAll(async (done) => {
    server.close(done);
})

describe('Order test', () => {
    let orderId;

    test('Is order possible to create?  "POST order/create" ', async () => {
        await request(server)
            .post('/order/create')
            .send({
                customerId: 1,
                productsOrdered: [
                    {productId: 4, amount: 10},
                    {productId: 2, amount: 5}
                ]
            })
            .expect(200)
            .then(response => {
                orderId = response.body.orderId;
            })
    });

    test('Is order available to see?, "GET order/single"', async () => {
        await request(server)
            .get('/order/single')
            .send({
                order_id: orderId
            })
            .expect(200)
    })

    test('Is order available to change status?', async () => {
        await request(server)
            .patch('/order/modify')
            .send({
                status: 1,
                id: orderId,
                user_id: 1
            })
            .expect(200)
    })

});