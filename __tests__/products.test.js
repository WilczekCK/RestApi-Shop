//routes.test.js
const request = require('supertest');
const server = require('../app.js');

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});

afterAll(async (done) => {
    server.close(done);
})

describe('Route tests', () => {
    test('Is product route available?  "/product" ', async () => {
        const response = await request(server).get('/product');
        expect(response.status).toEqual(200);
    });

});