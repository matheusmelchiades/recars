const mongoose = require('mongoose')
const config = {
    user: 'admin',
    password: 'qwer1234',
    host: 'ds155815.mlab.com',
    port: '55815',
    database: 'carsdb'
}

mongoose.connect(`mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`, { useNewUrlParser: true })

const BrandModel = mongoose.Schema({
    'id': Number,
    'name': String,
}, { versionKey: false })

const ModelModel = mongoose.Schema({
    "id": Number,
    "brand_id": String,
    "name": String
}, { versionKey: false })

const YearModel = mongoose.Schema({
    "id": String,
    "model_id": Number,
    "name": String,
}, { versionKey: false })

const CarModel = mongoose.Schema({
    "id": String,
    "brand_id": Number,
    "model_id": Number,
    "year_id": String,
    "fuel": String,
    "fipe_id": String,
    "monthRef": String,
    "typeVehicle": String,
    "sigleFuel": String
}, { versionKey: false })

module.exports = {
    brands: mongoose.model('brands', BrandModel),
    models: mongoose.model('models', ModelModel),
    years: mongoose.model('years', YearModel),
    cars: mongoose.model('cars', CarModel)
}