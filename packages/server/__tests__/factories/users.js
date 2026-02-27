const { factory } = require('factory-girl');
const faker = require('faker')
const UserModel = require('../../api/models/users')();

factory.define('user', UserModel, {
    username: faker.name.findName(),
    password: faker.internet.password()
})

class User_auth {
    constructor(user) {
        this.username = user.username
        this.token = user.token
    }
    save() { }
    destroy() { }
}

factory.define('user_auth', User_auth, async ({
    username = faker.name.findName(),
    password = faker.internet.password(),
    role = 'USER'
}) => {
    await factory.create('user', { username, password, role })
    return await UserModel.getToken({ username, password })
})

module.exports = factory