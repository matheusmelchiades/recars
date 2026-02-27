module.exports = (app) => {
    const { users } = app.api.controllers;
    const { authenticate } = app.api.auth.authenticate;

    app.route('/signup')
        .post(users.signup);

    app.route('/signin')
        .post(users.signin);

    app.route('/auth')
        .all(authenticate())
        .get((req, res) => res.status(200).send([]));
};
