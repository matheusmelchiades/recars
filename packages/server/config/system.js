require('dotenv').config();

module.exports = (app) => ({
    authSecret: process.env.AUTH_SECRET || 'secret',
    timeExpirateToken: 60,
    db: {
        database: process.env.DB_NAME || 'default',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '27017',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || ''
    },
    integrations: {
        azure: {
            url: process.env.API_IMG_URL || '',
            key: process.env.API_IMG_KEY || ''
        }
    }
});