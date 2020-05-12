//routes.test.js
const request = require('supertest');
const http = require('http');
const server = require('../app.js');
const mysql = require('../controllers/mysql_controler.js');
let testUserID;
let tokenReceived;

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});

afterAll(async (done) => {
    console.log('Jest closing!')
    testUserID = '';
    tokenReceived = '';

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

    test('Is possible to check existing user information and login to account "/account/findUser"', async () => {
        await request(server)
            .post('/account/login')
            .send({
                username: 'adam.kowalski@gmail.com',
                password: 'TestingPurposes12!'
            })
            .expect(function(res){
                tokenReceived = res.body.token;
                if(tokenReceived){
                    return 0;
                }else{
                    throw new Error('Login credentials are not valid')
                }
            })

        await request(server)
            .get('/account/findUser')
            .set('Authorization', `JWT ${tokenReceived}`)
            .expect(function(res){
                const {body} = res;
                if(body[0].email === 'adam.kowalski@gmail.com'){
                    return 0;
                }else if(body[0].email !== 'adam.kowalski@gmail.com'){
                    throw new Error('Modyfing is not correct')
                }else if(body[0].email == undefined){
                    throw new Error('There is no user like that')
                }
            })
    })

    test('Is possible to remove an account "/account/remove"', async () => {
        await request(server)
            .delete('/account/delete')
            .send({
                id: testUserID,
            })
            .expect(200)
        })
});