module.exports = (app) => {

    const { authenticate } = app.api.auth.authenticate;
    const { fieldsPermissions } = app.api.controllers;

    app.route('/fields')
        .all(authenticate())
        .get(fieldsPermissions.getFieldsByRole)
        .post(fieldsPermissions.createField);

};