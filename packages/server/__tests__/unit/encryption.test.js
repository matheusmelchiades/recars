const DB = require('../database');
const factory = require('../factories/users');
const helper = require('../../helper/encryption');

describe('Encryption', () => {
    beforeAll(() => DB.connect());
    beforeEach(() => DB.cleanUp());

    afterAll(() => DB.disconnect());

    it('should return true check password user encrypted', async () => {
        const user = await factory.create('user', {
            'password': '123'
        });

        const chek_pass = await helper.check('123', user.password)

        expect(chek_pass).toBe(true);
    });

    it('should return false check password user encrypted', async () => {
        const user = await factory.create('user', {
            'password': '12345'
        });

        const chek_pass = await helper.check('123', user.password)

        expect(chek_pass).toBe(false);
    });
});