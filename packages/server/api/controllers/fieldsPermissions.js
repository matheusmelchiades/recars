module.exports = (app) => {

    const model = app.api.models.fieldsPermissions;

    const getFieldsByRole = async (req, res) => {
        try {

            if (!req.user) return res.status(400).send('User not auth');

            const fieldDB = await model.findOne({ userRole: req.user.role });

            if (!fieldDB && !fieldDB.fields) return res.status(400).send('Error');

            return res.status(200).send(fieldDB.fields);

        } catch (err) {
            console.log(err);

            return res.status(400).send(err);
        }
    };

    const createField = async (req, res) => {
        try {

            if (!req.user.role !== 'ADMIN') return res.status(400).send('Not access');

            const { userRole, fields } = req.body;

            const field = await model.create({ userRole, fields });

            if (!field) return res.status(400).send('Erro em criar');

            return res.status(200).send(field);

        } catch (err) {
            console.log(err);

            return res.status(400).send(err);
        }
    };

    return { getFieldsByRole, createField };
};