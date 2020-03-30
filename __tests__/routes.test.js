//routes.test.js
const request = require('supertest');
const server = require('../app.js');

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});

afterAll(() => {
    // close the server after each test
    server.close();
    console.log('Server closed!');
}); 

describe('Route tests', () => {
    test('Is login route available?  "/login" ', async () => {
        const response = await request(server).get('/login');
        expect(response.status).toEqual(302);
    });

    test('Is order  route available?  "/order" ', async () => {
        const response = await request(server).get('/order');
        expect(response.status).toEqual(200);
    });
});