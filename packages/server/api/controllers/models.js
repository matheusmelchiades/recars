const ObjectId = require('mongoose').Types.ObjectId;

module.exports = (app) => {

    const modelCar = app.api.models.models;

    const getAll = async (req, res) => {
        try {
            const { brand, model } = req.query;

            if (brand || model) {
                const query = {};

                if (model) {
                    query.name = {
                        '$regex': model,
                        '$options': 'i'
                    };
                }

                if (brand && ObjectId.isValid(brand))
                    query.brand_id = ObjectId(brand);

                const modelsByBrandId = await modelCar.find(query);

                if (!modelsByBrandId) return res.status(400).send([]);

                return res.status(200).send(modelsByBrandId);
            }

            const modelsCar = await modelCar.find({});

            return res.status(200).send(modelsCar);
        } catch (err) {
            console.log(err);
            return res.status(400).send([]);
        }
    };

    return { getAll };
};