const DB = require('../database');
const request = require('supertest');
const factory = require('../factories/users');
const app = require('../../app');

describe('Users', () => {
    beforeAll(() => DB.connect());
    beforeEach(() => DB.cleanUp());

    afterAll(() => DB.disconnect());


    //SIGN UP
    it('should received message error without username', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                'password': 'test',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should received message error without password', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                'username': 'test',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should return a new user', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                'username': 'test',
                'password': '123456'
            });

        expect(response.status).toBe(200);
    });

    it('should received message error if user already exists', async () => {
        const user = await factory.create('user')

        const response = await request(app)
            .post('/signup')
            .send(user);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    //ARRUMAR DPS
    it('should received error internal', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                'username': 'test',
                'password': '123'
            });

        expect(response.status).toBe(200);
    })


    //SIGN IN
    it('should received message error without username', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                'password': 'test',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should received message error without password', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                'username': 'test',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should received message error if user not found', async () => {
        const response = await request(app)
            .post('/signin')
            .send({
                'username': 'test',
                'password': '123'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('should authenticated with valid credentials', async () => {
        const user = await factory.create('user', {
            'password': '123'
        });

        const response = await request(app)
            .post('/signin')
            .send({
                'username': user.username,
                'password': '123'
            })

        expect(response.status).toBe(200)
    });

    it('should not authenticated with invalid credentials', async () => {
        const user = await factory.create('user', {
            'password': '123'
        });

        const response = await request(app)
            .post('/signin')
            .send({
                'username': user.username,
                'password': '123456'
            })

        expect(response.status).toBe(401)
    });

    it('should return JWT token when authenticated', async () => {
        const user = await factory.create('user', {
            'password': '123'
        });

        const response = await request(app)
            .post('/signin')
            .send({
                'username': user.username,
                'password': '123'
            })

        expect(response.body).toHaveProperty('token')
    });

});