const helper = require('../../helper/algorithms');

module.exports = (app) => {

    const models = app.api.models;

    const find = async (req, res) => {
        try {

            const search = await models.searchs.create({ ...req.body, user: { ...req.user } });
            const cases = await models.cases.findBeetweenPrices(req.body.priceMin, req.body.priceMax);

            if (!search) return res.status(400).send('ERROR');
            if (!cases) return res.status(400).send('ERROR');

            const searchValues = await models.attributes.getValuesBySearch({ ...req.body });
            const casesValues = await models.attributes.getValuesByCases(cases);

            const result = helper.calculateSimCars(casesValues, searchValues, ['category', 'type', 'generalUse', 'competence']);

            const cars = await models.cars.findCarByModelMany(result);

            return res.status(200).send(cars);
        } catch (err) {
            console.log(err);
            return res.status(400).send('ERROR');
        }
    };

    return { find };
};