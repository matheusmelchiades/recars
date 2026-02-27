const mongoose = require('mongoose');

const BrandsSchema = new mongoose.Schema({
    name: String
});

module.exports = app => mongoose.model('brands', BrandsSchema);