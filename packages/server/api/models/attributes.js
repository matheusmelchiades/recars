const mongoose = require('mongoose');

const AttributesSchema = new mongoose.Schema(
    {
        search: Object,
        register: Object,
        options: Array
    },
    {
        timestamps: true,
        versionKey: false
    }
);

AttributesSchema.statics.getAllToCreate = function () {
    return new Promise((resolve, reject) => {
        this.find({}, (err, attributes) => {
            if (err) reject(err);

            const result = {};

            attributes.map((item) => {
                const toRegister = (opt) => opt.register;
                const allOptions = (a, b) => [...a, ...b];

                result[item.register.field] = item.options.map(toRegister).reduce(allOptions);
            });

            resolve(result);
        });
    });
};

AttributesSchema.statics.getAllToSearch = function () {
    return new Promise((resolve, reject) => {
        this.find({}, (err, attributes) => {
            if (err) reject(err);

            const result = {};

            attributes.map((item) => {
                const parent = (opt) => opt.search;

                result[item.search.field] = item.options.map(parent);
            });

            resolve(result);
        });
    });
};

AttributesSchema.statics.getValuesBySearch = function (search) {
    return new Promise((resolve, reject) => {
        this.find({}, (err, attributes) => {
            if (err) reject(err);

            const result = {};

            attributes.map((item) => {
                const field = item.search.field;

                item.options.map(itemSearch => {
                    if (itemSearch.search !== search[field]) return;

                    result[item.register.field] = {
                        'value': itemSearch.value
                    };
                });
            });

            resolve({ ...result });
        });
    });
};

AttributesSchema.statics.getValuesByCases = function (cases = []) {
    return new Promise((resolve, reject) => {
        this.find({}, (err, attributes) => {
            if (err) reject(err);

            const result = [];

            cases.map((aCase) => {
                const resultCase = {};

                attributes.map((item) => {
                    const field = item.register.field;

                    item.options.map(itemCase => {
                        if (!itemCase.register.includes(aCase[field])) return;

                        resultCase[field] = {
                            'value': itemCase.value
                        };
                    });
                });

                result.push({
                    'brand': aCase.brand,
                    'model': aCase.model,
                    'priceAverage': aCase.priceAverage,
                    'images': aCase.images,
                    ...resultCase
                });
            });

            resolve(result);
        });
    });
};

module.exports = (app) => mongoose.model('attributes', AttributesSchema);