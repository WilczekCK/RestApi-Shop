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

describe('Product test', () => {
    test('Is product display route available?  "GET /product" ', async () => {
        const response = await request(server).get('/product');
        expect(response.status).toEqual(200);
    });

    test('Is product possible to add?  "POST /product" ', async () => {
        await request(server)
            .post('/product')
            .send({
            name: 'Test',
            weight: 10, 
            price: 100,
            photo: 'Test.jpg',
            category: 'Test',
            nutritional_table: 'Test',
            vat_percentage: 23,
            url_name: 'Test'})
            .expect(200);
    });

    test('Is added product possible to see "GET /product/:name"', async () => {
        await request(server)
            .get('/product/Test')
            .expect(function(res){
                expect(res.body[0].name).toEqual('TestChanged')
            })
    })

    test('Is possible to change detail?', async () => {
        await request(server)
            .patch('/product/details')
            .send({rowsToChange: `name = 'TestChanged'`, condition: `name = 'Test'`})
            .expect(200)
    })

    test('Is possible to remove product?', async () => {
        let id;
        await request(server)
            .get('/product/Test')
            .expect((res) => {
                id = res.body[0].id
            })
            .expect(200)

        await request(server)
            .delete('/product')
            .send({id: id})
            .expect(200);
    })
});