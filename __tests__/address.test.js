//routes.test.js
const request = require('supertest');
const http = require('http');
const server = require('../app.js');
//const mysql = require('../controllers/mysql_controler.js');

let token;
let testAddressId;

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
    console.log('Jest closing!')
    server.close(done);
})

describe('Address test', () => {
    
    

    test('Is it possible to add the address?  "POST address/" ', async () => {

        await request(server)
        .post('/address')
        .set('Authorization', `JWT ${token}`)
        .send({
            id: 5,
            userId: 5,
            address: 'Warszawska 12',
            city: 'Krakowo',
            postCode: '21-231',
        })
        .expect( (res) => {
            testAddressId = res.body.rows.insertId;
            expect( res.body.status ).toBe(200)
        } ) 
        
    });

    test('Is it possible to get all user Addresses?  "GET address/" ', async () => {

        await request(server)
        .get('/address')
        .set('Authorization', `JWT ${token}`)
        .expect( res => {
            expect( res.status ).toBe(200)
        } ) 
        
    });

    test('Is it possible to get specific address?  "GET address/:id" ', async () => {

        await request(server)
        .get(`/address/${testAddressId}`)
        .set('Authorization', `JWT ${token}`)
        .expect( res => {
            expect( res.status ).toBe(200)
        } ) 
        
    });
    
    test('Is it possible to change Address?  "PATCH address/" ', async () => {

        await request(server)
        .patch('/address/details')
        .set('Authorization', `JWT ${token}`)
        .send({
            userId: 5,
            id: testAddressId,
            rowsToChange: `post_code = '99-999'`
        })
        .expect( (res) => {
            expect( res.body.status ).toBe(200)
        } ) 
        
    });

    test('Is it possible to delete the Address?  "DELETE address/" ', async () => {

        await request(server)
        .delete('/address/delete')
        .set('Authorization', `JWT ${token}`)
        .send({
            id: testAddressId,
        })
        .expect( (res) => {
            expect( res.body.status ).toBe(200)
        } ) 
        
    });

    test('Is error thrown if parameter is missing?  "POST address/" ', async () => {

        await request(server)
        .post('/address')
        .set('Authorization', `JWT ${token}`)
        .send({
            userId: 5,
            // address: 'Warszawska 12',
            city: 'Krakowo',
            postCode: '21-231',
        })
        .expect( (res) => {
            expect( res.body.status ).toBe( 400 )
        } ) 
        
    });


});