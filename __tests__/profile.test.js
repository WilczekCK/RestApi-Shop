//routes.test.js
const request = require('supertest');
const http = require('http');
const server = require('../app.js');
const mysql = require('../controllers/mysql_controler.js');
let testUserID;

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});

afterAll(async (done) => {
    console.log('Jest closing!')
    server.close(done);
})

describe('Profile test', () => {
    test('Is profile possible to add?  "POST account/register" ', async () => {
        await request(server)
            .post('/account/register')
            .send({
            firstName: 'Adam',
            secondName: 'Kowalsky',
            email: 'adam.kowalsky@gmail.com',
            password: 'TestingPurposes12!',
            phone: 231213421,
            street: 'Warszawska 12',
            city: 'Cracow',
            postCode: '21-231'
            })
            .expect(200);

            id = await mysql.showCertain(`users`, `id`, `email = 'adam.kowalsky@gmail.com'`);
            testUserID = id[0].id;
    });

    test('Is added profile possible to login "POST account/login"', async () => {
        await request(server)
            .post('/account/login')
            .send({
                username: 'adam.kowalsky@gmail.com',
                password: 'TestingPurposes12!'
            })
            .expect(200)
    })

    test('Is possible to change information in some profile "PATCH account/details', async () => {
        await request(server)
            .patch('/account/details')
            .send({
                id: testUserID,
                rowsToChange: `email = 'adam.kowalski@gmail.com'`
            })
            .expect(200);
    })
});