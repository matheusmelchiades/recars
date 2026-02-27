module.exports = (app) => {
    const { authenticate } = app.api.auth.authenticate;
    const { cases } = app.api.controllers;

    app.route('/cases')
        .all(authenticate())
        .get(cases.getAll)
        .post(cases.create)
        .delete(cases.deleteCase);

    app.route('/cases/pending')
        .all(authenticate())
        .get(cases.getCasesPending)
        .post(cases.approveCase);
};
