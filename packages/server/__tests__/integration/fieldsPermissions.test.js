const DB = require('../database');
const request = require('supertest');
const app = require('../../app');
const factoryUser = require('../factories/users');
const factoryField = require('../factories/fieldsPermissions');

describe('Fields Permissions', () => {

    beforeAll(() => DB.connect());
    beforeEach(() => DB.cleanUp());

    afterAll(() => DB.disconnect());

    it('should return fields when the user is role admin', async () => {
        const user = await factoryUser.create('user_auth', {}, {
            role: 'ADMIN'
        });
        await factoryField.create('fields_admin')

        const response = await request(app)
            .get('/fields')
            .set('Authorization', `bearer ${user.token}`)

        expect(response.status).toBe(200)
    });

    it('should return fields when the user is role helper', async () => {
        const user = await factoryUser.create('user_auth', {}, {
            role: 'HELPER'
        });
        await factoryField.create('fields_helper')

        const response = await request(app)
            .get('/fields')
            .set('Authorization', `bearer ${user.token}`)

        expect(response.status).toBe(200)
    });

    it('should return fields when the user is auth', async () => {
        const user = await factoryUser.create('user_auth');
        await factoryField.create('fields')

        const response = await request(app)
            .get('/fields')
            .set('Authorization', `bearer ${user.token}`)

        expect(response.status).toBe(200)
    });

    it('should return fields when the user is auth', async () => {
        const user = await factoryUser.create('user_auth');
        await factoryField.create('fields')

        const response = await request(app)
            .get('/fields')
            .set('Authorization', `bearer ${user.token}`)

        expect(response.status).toBe(200)
    });
});