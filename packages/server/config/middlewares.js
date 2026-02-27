const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const test = !!process.env.NODE_ENV;

module.exports = (app) => {
    if (!test) app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors({ origin: '*' }));
};