const mongoose = require('mongoose');

const ModelsSchema = new mongoose.Schema({
    brand_id: mongoose.Schema.Types.ObjectId,
    name: String,
    priceAverage: Number
});

module.exports = app => mongoose.model('models', ModelsSchema);