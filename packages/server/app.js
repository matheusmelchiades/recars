const consign = require('consign');
const express = require('express');
const app = express();

consign({ verbose: process.env.NODE_ENV !== 'test' })
    .then('config')
    .then('api/models')
    .then('api/controllers')
    .then('api/auth')
    .then('api/routes')
    .into(app);

module.exports = app;