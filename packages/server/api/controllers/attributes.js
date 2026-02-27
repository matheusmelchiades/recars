module.exports = (app) => {

    const model = app.api.models.attributes;

    const getAllToCreate = async (req, res) => {
        try {
            const attributes = await model.getAllToCreate({});

            if (!attributes) return res.status(400).send('NOT found Attributes');

            return res.status(200).send(attributes);
        } catch (err) {
            console.log(err);
            return res.status(400).send('ERROR!');
        }
    };

    const getAllToSearch = async (req, res) => {
        try {
            const attributes = await model.getAllToSearch({});

            if (!attributes) return res.status(400).send('NOT found Attributes');

            return res.status(200).send(attributes);
        } catch (err) {
            console.log(err);
            return res.status(400).send('ERROR');
        }
    };

    return { getAllToCreate, getAllToSearch };
};