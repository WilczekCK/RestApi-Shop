const request = require('supertest');
const http = require('http');
const server = require('../app.js');

const profile = require('../controllers/profile_controler');
const address = require('../controllers/address_controler');
const order = require('../controllers/order_controler');

let addressId, profileId, orderId;

beforeAll( () => {
    console.log('Jest starting!');
})

afterAll( async ( done ) => {
    await address.removeAddress( { id: addressId }, -1);
    await profile.remove( { id: profileId } );
    await order.removeOrder( { orderId: orderId  }, profileId );
    console.log('Jest closing!')
    server.close(done);
} )

const user = {
    email: "nowy@gmail.com",
    phone: 607783126,
    firstName: "Artur",
    secondName: "Nowak",
}
const payment = 'payu';
const cart = [
    {productId: 37, amount: 1},
    {productId: 39, amount: 1},
    {productId: 38, amount: 1},
    {productId: 42, amount: 1},
    {productId: 43, amount: 1},
    {productId: 52, amount: 1},
]

describe('Address test', () => {
    
    test('Is it possible to add the address as guest?  "POST address/noauth" ', async () => {
        await request(server)
        .post('/address/noauth')
        .send({
            address: 'Warszawska 12',
            city: 'Krakowo',
            postCode: '21-231',
        })
        .expect( (res) => {
            addressId = res.body.rows.insertId;
            expect( res.body.status ).toBe(200)
        } ) 
    });

    test('Is it possible to create an order as a guest?  "POST order/noauth" ', async () => {
        await request(server)
        .post('/order/create/noauth')
        .send({
            productsOrdered: cart,
            address: addressId,
            payment: payment,
            user: user
        })
        .expect( (res) => {
            orderId = res.body.orderResponse.orderId;
            profileId = res.body.orderResponse.customerId;
            expect( res.body.orderResponse.status ).toBe( 200 )
        } ) 
    });
})