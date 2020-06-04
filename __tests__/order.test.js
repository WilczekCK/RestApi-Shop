const request = require('supertest');
const http = require('http');
const server = require('../app.js');
let token;

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');

    await request(server)
    .post('/account/login')
    .send({
        username: 'qwe',
        password: 'qwe',
    })
    .expect( res => {
        token = res.body.token
        if(token){
            return 0;
        }else{
            throw new Error('Login credentials are not valid')
        }
    })
});

afterAll(async (done) => {
    server.close(done);
})

describe('Order test', () => {
    let orderId;

    test('Is order possible to create?  "POST order/create" ', async () => {
        await request(server)
            .post('/order/create')
            .set('Authorization', `JWT ${token}`)
            .send({
                customerId: 1,
                productsOrdered: [
                    {productId: 4, amount: 10},
                    {productId: 2, amount: 5}
                ],
                address: 20,
                payment: 'cash-on-delivery',
            })
            .expect(200)
            .then(response => {
                orderId = response.body.orderId;
            })
    });

    test('Is order available to see?, "GET order/single"', async () => {
        await request(server)
            .get(`/order/single?order_id=${orderId}`)
            .set('Authorization', `JWT ${token}`)
            .send({
                order_id: orderId
            })
            .expect(200)
    })

    test('Is order available to change status?', async () => {
        await request(server)
            .patch('/order/modify')
            .set('Authorization', `JWT ${token}`)
            .send({
                status: 1,
                id: orderId,
                user_id: 1
            })
            .expect(200)
    })

    test('Is order available to remove?', async () => {
        await request(server)
            .delete('/order/remove')
            .set('Authorization', `JWT ${token}`)
            .send({
                customerId: 1,
                orderId: orderId
            })
            .expect(200)
    })
});