const mongoose = require('mongoose')
const config = {
    user: 'admin',
    password: 'qwer1234',
    host: 'ds155815.mlab.com',
    port: '55815',
    database: 'carsdb'
}

mongoose.connect(`mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`, { useNewUrlParser: true })


const YearModel = mongoose.Schema({
    "id": String,
    "model_id": String,
    "name": String,
}, { versionKey: false })

const ModelModel = mongoose.Schema({
    "id": String,
    "brand_id": String,
    "name": String
}, { versionKey: false })

const BrandModel = mongoose.Schema({
    'id': String,
    'name': String,
}, { versionKey: false })

const CarModel = mongoose.Schema({
    "id": String,
    "brand_id": String,
    "model_id": String,
    "year_id": String,
    "fuel": String,
    "fipe_id": String,
    "monthRef": String,
    "typeVehicle": String,
    "sigleFuel": String
}, { versionKey: false })

module.exports = {
    brands: mongoose.model('api_brands', BrandModel),
    models: mongoose.model('api_models', ModelModel),
    years: mongoose.model('api_years', YearModel),
    cars: mongoose.model('api_cars', CarModel)
}