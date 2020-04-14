//routes.test.js
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

describe('Route tests', () => {
    test('Is product display route available?  "GET /product" ', async () => {
        const response = await request(server).get('/product');
        expect(response.status).toEqual(200);
    });

    test('Is product possible to add?  "POST /product" ', async () => {

    });

});