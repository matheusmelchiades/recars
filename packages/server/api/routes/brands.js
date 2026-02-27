module.exports = (app) => {
    const { authenticate } = app.api.auth.authenticate;
    const { brands } = app.api.controllers;

    app.route('/brands')
        .all(authenticate())
        .get(brands.getAll);
};
