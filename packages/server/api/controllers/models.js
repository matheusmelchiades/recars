const ObjectId = require('mongoose').Types.ObjectId;

module.exports = (app) => {

    const modelCar = app.api.models.models;

    const getAll = async (req, res) => {
        const { brand, model } = req.query;
        const User = req.user;

        if (User.role === 'USER') return res.status(400).send('Unauthorized');

        if (brand || model) {
            const query = {
                name: {
                    '$regex': model,
                    '$options': 'i'
                }
            };

            if (brand && ObjectId.isValid(brand))
                query.brand_id = ObjectId(brand);

            const modelsByBrandId = await modelCar.find(query);

            if (!modelsByBrandId) return res.status(400).send([]);

            return res.status(200).send(modelsByBrandId);
        }

        const modelsCar = await model.find({});

        return res.status(200).send(modelsCar);
    };

    return { getAll };
};