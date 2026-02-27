const { factory } = require('factory-girl');
const faker = require('faker')
const model = require('../../api/models/fieldsPermissions')();

const menus = (n = 0) => [Array(n).fill({ path: '/', label: faker.internet.userName() })];

factory.define('fields_admin', model, {
    userRole: 'ADMIN',
    fields: {
        menu: menus(3)
    }
})

factory.define('fields_helper', model, {
    userRole: 'HELPER',
    fields: {
        menu: menus(2)
    }
})
factory.define('fields', model, {
    userRole: 'USER',
    fields: {
        menu: menus(1)
    }
})

module.exports = factory