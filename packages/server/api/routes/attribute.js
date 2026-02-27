module.exports = (app) => {
    const { authenticate } = app.api.auth.authenticate;
    const { attributes } = app.api.controllers;

    app.route('/attributes/createCase')
        .all(authenticate())
        .get(attributes.getAllToCreate);

    app.route('/attributes/search')
        .all(authenticate())
        .get(attributes.getAllToSearch);
};
