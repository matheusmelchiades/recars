const mongoose = require('mongoose');
const config = require('./system')().db;

const uri = config.user
    ? `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=admin`
    : `mongodb://${config.host}:${config.port}/${config.database}`;

module.exports = process.env.NODE_ENV !== 'test' ? mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err, connect) => !err ? console.log('Connect database') : console.log('Error connect database')) : null;