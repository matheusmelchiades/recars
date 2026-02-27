module.exports = (app) => {
    const { authenticate } = app.api.auth.authenticate;
    const { search } = app.api.controllers;

    app.route('/search')
        .all(authenticate())
        .post(search.find);
};