require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config/system')().db;

const uri = config.user
    ? `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=admin`
    : `mongodb://${config.host}:${config.port}/${config.database}`;

const FieldsPermissionsSchema = new mongoose.Schema(
    { userRole: String, fields: mongoose.Schema.Types.Mixed },
    { collection: 'fieldsPermissions' }
);
const FieldsPermissions = mongoose.model('fieldsPermissions', FieldsPermissionsSchema);

const seeds = [
    {
        userRole: 'ADMIN',
        fields: {
            menu: [
                { path: '/', label: 'Buscar' },
                { path: '/case', label: 'Novo Caso' },
                { path: '/penging', label: 'Pendências' },
                { path: '/cases', label: 'Aprovados' }
            ]
        }
    },
    {
        userRole: 'HELPER',
        fields: {
            menu: [
                { path: '/', label: 'Buscar' },
                { path: '/penging', label: 'Pendências' },
                { path: '/cases', label: 'Aprovados' }
            ]
        }
    },
    {
        userRole: 'USER',
        fields: {
            menu: [
                { path: '/', label: 'Buscar' },
                { path: '/case', label: 'Novo Caso' },
                { path: '/cases', label: 'Aprovados' }
            ]
        }
    }
];

async function seed() {
    await mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
    console.log('Connected to database');

    for (const data of seeds) {
        const exists = await FieldsPermissions.findOne({ userRole: data.userRole });
        if (!exists) {
            await FieldsPermissions.create(data);
            console.log(`Created fieldsPermissions for role: ${data.userRole}`);
        } else {
            console.log(`Already exists for role: ${data.userRole}, skipping`);
        }
    }

    await mongoose.disconnect();
    console.log('Seed complete');
}

seed().catch(err => { console.error(err); process.exit(1); });
