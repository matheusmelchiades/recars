module.exports = (app) => {

    const { authenticate } = app.api.auth.authenticate;
    const { images } = app.api.controllers;

    app.route('/images')
        .all(authenticate())
        .get(images.searchImage);

};