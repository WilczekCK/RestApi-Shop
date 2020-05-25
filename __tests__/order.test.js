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
        console.log('find' +orderId)
        await request(server)
            .get('/order/single')
            .send({
                order_id: orderId
            })
            .expect(200)
    })

});