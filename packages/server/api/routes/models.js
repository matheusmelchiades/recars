module.exports = (app) => {
    const { authenticate } = app.api.auth.authenticate;
    const { models } = app.api.controllers;

    app.route('/models')
        .all(authenticate())
        .get(models.getAll);
};