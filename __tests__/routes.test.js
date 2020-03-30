//routes.test.js
const request = require('supertest');
const server = require('../app.js');

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});

describe('Route tests', () => {
    test('Is login route available?  "/login" ', async () => {
        const response = await request(server).get('/login');
        expect(response.status).toEqual(200);
    });

    test('Is register route available?  "/register" ', async () => {
        const response = await request(server).get('/register');
        expect(response.status).toEqual(200);
    });

    test('Is account route available?  "/account" ', async () => {
        const response = await request(server).get('/account');
        expect(response.status).toEqual(200);
    });

    test('Is product route available?  "/product" ', async () => {
        const response = await request(server).get('/product');
        expect(response.status).toEqual(200);
    });
});