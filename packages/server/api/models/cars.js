const mongoose = require('mongoose');

const carsSchema = new mongoose.Schema(
    {
        brand_id: mongoose.Types.ObjectId,
        model_id: mongoose.Types.ObjectId,
        year: Number,
        price: Number,
        fuel: {
            type: String,
            enum: ['G', 'D', 'A']
        }
    }, {
        timestamps: true,
        versionKey: false
    }
);

carsSchema.statics.findCarByModelMany = async function (cars) {
    return new Promise((resolve, reject) => {
        const promises = cars.map(async (car) => {
            const yearMax = (array) => Math.max.apply(Math, array);
            const yearMin = (array) => Math.min.apply(Math, array);
            const distinct = (value, index, self) => self.indexOf(value) === index;
            const formatFuel = (fuel) => {
                if (fuel === 'G') return 'Gasolina';
                if (fuel === 'A') return 'Alcool';
                if (fuel === 'D') return 'Diesel';
                return ' ';
            };

            const data = await this.aggregate([
                { '$match': { 'year': { '$lt': new Date().getFullYear() } } },
                {
                    '$lookup': {
                        'from': 'brands',
                        'localField': 'brand_id',
                        'foreignField': '_id',
                        'as': 'brand'
                    }
                },
                { '$unwind': '$brand' },
                {
                    '$lookup': {
                        'from': 'models',
                        'localField': 'model_id',
                        'foreignField': '_id',
                        'as': 'model'
                    }
                },
                { '$unwind': '$model' },
                { '$match': { 'brand.name': car.brand } },
                { '$match': { 'model.name': car.model } },
                {
                    '$group': {
                        '_id': null,
                        'years': { '$push': '$year' },
                        'fuels': { '$push': '$fuel' }
                    }
                },
                { '$project': { '_id': 0 } }
            ]);

            return {
                ...car,
                'years': `${yearMin(data[0].years)} a ${yearMax(data[0].years)}`,
                'fuels': data[0].fuels.filter(distinct).map(formatFuel)
            };

        });

        return Promise.all(promises).then(results => resolve(results));
        // return resolve(promises);
    });
};

module.exports = (app) => mongoose.model('cars', carsSchema);