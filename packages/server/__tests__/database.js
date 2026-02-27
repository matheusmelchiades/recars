const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

class Db_TEST {
    constructor() {
        this.connection = null;
        this.mongoServer = new MongoMemoryServer();
        this.mongoose = mongoose;
        this.opts = {
            useNewUrlParser: true,
            useCreateIndex: true
        }
    }

    async connect() {
        const mongoUrl = await this.mongoServer.getConnectionString()
        this.connection = await this.mongoose.connect(mongoUrl, this.opts);
    };

    disconnect() {
        this.mongoose.disconnect();
        this.mongoServer.stop();
    };


    cleanUp() {
        const COLLECTIONS = Object.keys(this.connection.models)
        return Promise.all(COLLECTIONS.map(collenction => this.connection.models[collenction].deleteOne({})))
    }
}

module.exports = new Db_TEST