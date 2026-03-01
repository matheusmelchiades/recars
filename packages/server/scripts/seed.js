require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config/system')().db;

const uri = config.user
    ? `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=admin`
    : `mongodb://${config.host}:${config.port}/${config.database}`;

// ─── Schemas ────────────────────────────────────────────────────────────────

const FieldsPermissions = mongoose.model('fieldsPermissions', new mongoose.Schema(
    { userRole: String, fields: mongoose.Schema.Types.Mixed },
    { collection: 'fieldsPermissions' }
));
const Brand = mongoose.model('brands', new mongoose.Schema({ name: String }));
const Model = mongoose.model('models', new mongoose.Schema({
    brand_id: mongoose.Schema.Types.ObjectId, name: String, priceAverage: Number
}));
const Car = mongoose.model('cars', new mongoose.Schema({
    brand_id: mongoose.Schema.Types.ObjectId,
    model_id: mongoose.Schema.Types.ObjectId,
    year: Number, price: Number, fuel: String
}, { versionKey: false }));
const Attribute = mongoose.model('attributes', new mongoose.Schema(
    { search: Object, register: Object, options: Array },
    { timestamps: true, versionKey: false }
));
const User = mongoose.model('users', new mongoose.Schema(
    { username: String, role: String }, { versionKey: false }
));
const Case = mongoose.model('cases', new mongoose.Schema({
    model: String, brand: String, category: String, type: String,
    generalUse: String, competence: String, priceAverage: Number,
    images: Array, status: String, quantity: { type: Number, default: 1 },
    createdBy: mongoose.Schema.Types.ObjectId
}, { versionKey: false, timestamps: true }));

// ─── Seed Data ───────────────────────────────────────────────────────────────

const FIELDS_PERMISSIONS = [
    {
        userRole: 'ADMIN',
        fields: { menu: [
            { path: '/', label: 'Buscar' }, { path: '/case', label: 'Novo Caso' },
            { path: '/penging', label: 'Pendências' }, { path: '/cases', label: 'Aprovados' }
        ]}
    },
    {
        userRole: 'HELPER',
        fields: { menu: [
            { path: '/', label: 'Buscar' },
            { path: '/penging', label: 'Pendências' }, { path: '/cases', label: 'Aprovados' }
        ]}
    },
    {
        userRole: 'USER',
        fields: { menu: [
            { path: '/', label: 'Buscar' }, { path: '/case', label: 'Novo Caso' },
            { path: '/cases', label: 'Aprovados' }
        ]}
    }
];

// Atributos: mapeiam campos de busca (search.field) → campos dos casos (register.field)
// A busca usa: places, placeUsed, classUse, motor
// Os casos guardam: category, type, generalUse, competence
// O algoritmo calcula distância euclidiana entre os values numéricos
const ATTRIBUTES = [
    {
        search:   { field: 'places' },
        register: { field: 'category' },
        options: [
            { search: '2 lugares',  register: ['COUPE', 'CONVERSIVEL'],       value: 1 },
            { search: '4 lugares',  register: ['HATCH', 'SEDAN'],             value: 2 },
            { search: '5 lugares',  register: ['SUV', 'CROSSOVER'],           value: 3 },
            { search: '7 lugares',  register: ['MINIVAN', 'VAN', 'PICKUP'],   value: 4 },
        ]
    },
    {
        search:   { field: 'placeUsed' },
        register: { field: 'type' },
        options: [
            { search: 'Cidade',    register: ['URBANO', 'COMPACTO'],    value: 1 },
            { search: 'Estrada',   register: ['EXECUTIVO', 'PREMIUM'],  value: 2 },
            { search: 'Campo',     register: ['OFF-ROAD', 'RURAL'],     value: 3 },
            { search: 'Misto',     register: ['CROSSOVER', 'SUV'],      value: 4 },
        ]
    },
    {
        search:   { field: 'classUse' },
        register: { field: 'generalUse' },
        options: [
            { search: 'Passeio',          register: ['PASSEIO'],         value: 1 },
            { search: 'Trabalho leve',    register: ['TRABALHO_LEVE'],   value: 2 },
            { search: 'Trabalho pesado',  register: ['TRABALHO_PESADO'], value: 3 },
            { search: 'Esporte',          register: ['ESPORTE'],         value: 4 },
        ]
    },
    {
        search:   { field: 'motor' },
        register: { field: 'competence' },
        options: [
            { search: 'Até 1.0',       register: ['1.0', '1.0 TURBO'],    value: 1 },
            { search: '1.4 a 1.6',     register: ['1.4', '1.6'],          value: 2 },
            { search: '2.0',           register: ['2.0', '2.0 TURBO'],    value: 3 },
            { search: 'Acima de 2.0',  register: ['2.5', '3.0', '3.5'],   value: 4 },
        ]
    }
];

const BRANDS = ['Fiat', 'Volkswagen', 'Chevrolet', 'Ford', 'Toyota', 'Honda', 'Hyundai', 'Renault', 'Jeep', 'Nissan'];

const MODELS_BY_BRAND = {
    'Fiat':       [{ name: 'Mobi', p: 58000 }, { name: 'Uno', p: 38000 }, { name: 'Argo', p: 72000 }, { name: 'Cronos', p: 82000 }, { name: 'Toro', p: 130000 }, { name: 'Strada', p: 90000 }],
    'Volkswagen': [{ name: 'Gol', p: 52000 }, { name: 'Polo', p: 88000 }, { name: 'Virtus', p: 95000 }, { name: 'T-Cross', p: 125000 }, { name: 'Saveiro', p: 78000 }, { name: 'Amarok', p: 280000 }],
    'Chevrolet':  [{ name: 'Onix', p: 78000 }, { name: 'Prisma', p: 65000 }, { name: 'Tracker', p: 130000 }, { name: 'S10', p: 220000 }, { name: 'Spin', p: 110000 }],
    'Ford':       [{ name: 'Ka', p: 48000 }, { name: 'EcoSport', p: 105000 }, { name: 'Ranger', p: 230000 }, { name: 'Territory', p: 175000 }],
    'Toyota':     [{ name: 'Corolla', p: 155000 }, { name: 'Hilux', p: 280000 }, { name: 'SW4', p: 320000 }, { name: 'Yaris', p: 98000 }],
    'Honda':      [{ name: 'Civic', p: 145000 }, { name: 'HR-V', p: 145000 }, { name: 'City', p: 112000 }, { name: 'Fit', p: 88000 }],
    'Hyundai':    [{ name: 'HB20', p: 68000 }, { name: 'Creta', p: 130000 }, { name: 'Tucson', p: 175000 }, { name: 'i30', p: 110000 }],
    'Renault':    [{ name: 'Kwid', p: 58000 }, { name: 'Sandero', p: 68000 }, { name: 'Duster', p: 95000 }, { name: 'Logan', p: 72000 }],
    'Jeep':       [{ name: 'Renegade', p: 138000 }, { name: 'Compass', p: 195000 }, { name: 'Commander', p: 265000 }],
    'Nissan':     [{ name: 'Versa', p: 82000 }, { name: 'Kicks', p: 120000 }, { name: 'Frontier', p: 240000 }],
};

// Casos aprovados para alimentar a busca
// category/type/generalUse/competence devem estar nos arrays "register" dos atributos acima
const CASES_TEMPLATE = [
    // Econômicos (30k–80k)
    { brand: 'Fiat',       model: 'Mobi',     category: 'HATCH',    type: 'URBANO',     generalUse: 'PASSEIO',        competence: '1.0',      price: 58000 },
    { brand: 'Volkswagen', model: 'Gol',      category: 'HATCH',    type: 'COMPACTO',   generalUse: 'PASSEIO',        competence: '1.0',      price: 52000 },
    { brand: 'Renault',    model: 'Kwid',     category: 'HATCH',    type: 'URBANO',     generalUse: 'PASSEIO',        competence: '1.0',      price: 58000 },
    { brand: 'Ford',       model: 'Ka',       category: 'HATCH',    type: 'COMPACTO',   generalUse: 'PASSEIO',        competence: '1.0',      price: 48000 },
    { brand: 'Fiat',       model: 'Uno',      category: 'HATCH',    type: 'URBANO',     generalUse: 'TRABALHO_LEVE',  competence: '1.0 TURBO',price: 38000 },
    // Intermediários (80k–150k)
    { brand: 'Fiat',       model: 'Argo',     category: 'HATCH',    type: 'URBANO',     generalUse: 'PASSEIO',        competence: '1.6',      price: 72000 },
    { brand: 'Volkswagen', model: 'Polo',     category: 'HATCH',    type: 'URBANO',     generalUse: 'ESPORTE',        competence: '1.6',      price: 88000 },
    { brand: 'Chevrolet',  model: 'Onix',     category: 'HATCH',    type: 'COMPACTO',   generalUse: 'PASSEIO',        competence: '1.0 TURBO',price: 78000 },
    { brand: 'Hyundai',    model: 'HB20',     category: 'HATCH',    type: 'COMPACTO',   generalUse: 'PASSEIO',        competence: '1.0',      price: 68000 },
    { brand: 'Fiat',       model: 'Cronos',   category: 'SEDAN',    type: 'EXECUTIVO',  generalUse: 'PASSEIO',        competence: '1.6',      price: 82000 },
    { brand: 'Renault',    model: 'Duster',   category: 'SUV',      type: 'CROSSOVER',  generalUse: 'PASSEIO',        competence: '1.6',      price: 95000 },
    { brand: 'Volkswagen', model: 'Virtus',   category: 'SEDAN',    type: 'EXECUTIVO',  generalUse: 'PASSEIO',        competence: '1.6',      price: 95000 },
    { brand: 'Honda',      model: 'Fit',      category: 'HATCH',    type: 'URBANO',     generalUse: 'PASSEIO',        competence: '1.4',      price: 88000 },
    { brand: 'Toyota',     model: 'Yaris',    category: 'SEDAN',    type: 'EXECUTIVO',  generalUse: 'PASSEIO',        competence: '1.4',      price: 98000 },
    { brand: 'Fiat',       model: 'Strada',   category: 'PICKUP',   type: 'RURAL',      generalUse: 'TRABALHO_LEVE',  competence: '1.4',      price: 90000 },
    { brand: 'Volkswagen', model: 'Saveiro',  category: 'PICKUP',   type: 'RURAL',      generalUse: 'TRABALHO_LEVE',  competence: '1.6',      price: 78000 },
    { brand: 'Chevrolet',  model: 'Spin',     category: 'MINIVAN',  type: 'URBANO',     generalUse: 'PASSEIO',        competence: '1.6',      price: 110000 },
    { brand: 'Ford',       model: 'EcoSport', category: 'SUV',      type: 'CROSSOVER',  generalUse: 'PASSEIO',        competence: '1.6',      price: 105000 },
    { brand: 'Nissan',     model: 'Versa',    category: 'SEDAN',    type: 'EXECUTIVO',  generalUse: 'PASSEIO',        competence: '1.6',      price: 82000 },
    { brand: 'Hyundai',    model: 'Creta',    category: 'SUV',      type: 'CROSSOVER',  generalUse: 'PASSEIO',        competence: '1.6',      price: 130000 },
    // Premium (150k+)
    { brand: 'Toyota',     model: 'Corolla',  category: 'SEDAN',    type: 'PREMIUM',    generalUse: 'ESPORTE',        competence: '2.0',      price: 155000 },
    { brand: 'Honda',      model: 'Civic',    category: 'SEDAN',    type: 'PREMIUM',    generalUse: 'ESPORTE',        competence: '2.0 TURBO',price: 145000 },
    { brand: 'Honda',      model: 'HR-V',     category: 'SUV',      type: 'CROSSOVER',  generalUse: 'ESPORTE',        competence: '1.6',      price: 145000 },
    { brand: 'Jeep',       model: 'Renegade', category: 'SUV',      type: 'SUV',        generalUse: 'ESPORTE',        competence: '2.0',      price: 138000 },
    { brand: 'Jeep',       model: 'Compass',  category: 'SUV',      type: 'SUV',        generalUse: 'ESPORTE',        competence: '2.0 TURBO',price: 195000 },
    { brand: 'Volkswagen', model: 'T-Cross',  category: 'SUV',      type: 'CROSSOVER',  generalUse: 'PASSEIO',        competence: '1.0 TURBO',price: 125000 },
    { brand: 'Chevrolet',  model: 'Tracker',  category: 'SUV',      type: 'CROSSOVER',  generalUse: 'PASSEIO',        competence: '1.0 TURBO',price: 130000 },
    { brand: 'Nissan',     model: 'Kicks',    category: 'SUV',      type: 'CROSSOVER',  generalUse: 'PASSEIO',        competence: '1.6',      price: 120000 },
    { brand: 'Ford',       model: 'Territory',category: 'SUV',      type: 'SUV',        generalUse: 'ESPORTE',        competence: '1.6',      price: 175000 },
    { brand: 'Hyundai',    model: 'Tucson',   category: 'SUV',      type: 'SUV',        generalUse: 'ESPORTE',        competence: '2.0',      price: 175000 },
    // Trabalho pesado / utilitários
    { brand: 'Fiat',       model: 'Toro',     category: 'PICKUP',   type: 'RURAL',      generalUse: 'TRABALHO_PESADO',competence: '2.0',      price: 130000 },
    { brand: 'Toyota',     model: 'Hilux',    category: 'PICKUP',   type: 'OFF-ROAD',   generalUse: 'TRABALHO_PESADO',competence: '3.0',      price: 280000 },
    { brand: 'Volkswagen', model: 'Amarok',   category: 'PICKUP',   type: 'OFF-ROAD',   generalUse: 'TRABALHO_PESADO',competence: '2.0 TURBO',price: 280000 },
    { brand: 'Chevrolet',  model: 'S10',      category: 'PICKUP',   type: 'RURAL',      generalUse: 'TRABALHO_PESADO',competence: '2.5',      price: 220000 },
    { brand: 'Ford',       model: 'Ranger',   category: 'PICKUP',   type: 'OFF-ROAD',   generalUse: 'TRABALHO_PESADO',competence: '3.0',      price: 230000 },
    { brand: 'Nissan',     model: 'Frontier', category: 'PICKUP',   type: 'OFF-ROAD',   generalUse: 'TRABALHO_PESADO',competence: '2.5',      price: 240000 },
    { brand: 'Toyota',     model: 'SW4',      category: 'SUV',      type: 'OFF-ROAD',   generalUse: 'TRABALHO_PESADO',competence: '3.0',      price: 320000 },
    { brand: 'Jeep',       model: 'Commander',category: 'VAN',      type: 'SUV',        generalUse: 'ESPORTE',        competence: '2.0 TURBO',price: 265000 },
];

// ─── Seed Functions ──────────────────────────────────────────────────────────

async function seedCollection(name, Model, data, keyField) {
    let created = 0, skipped = 0;
    for (const item of data) {
        const query = { [keyField]: item[keyField] };
        const exists = await Model.findOne(query);
        if (!exists) { await Model.create(item); created++; }
        else skipped++;
    }
    console.log(`[${name}] criados: ${created}, pulados: ${skipped}`);
}

async function seedBrandsAndModels() {
    const brandMap = {};
    for (const name of BRANDS) {
        let brand = await Brand.findOne({ name });
        if (!brand) brand = await Brand.create({ name });
        brandMap[name] = brand._id;
    }
    console.log(`[brands] ${BRANDS.length} marcas garantidas`);

    const modelMap = {};
    let created = 0, skipped = 0;
    for (const [brandName, models] of Object.entries(MODELS_BY_BRAND)) {
        const brand_id = brandMap[brandName];
        for (const { name, p } of models) {
            let model = await Model.findOne({ brand_id, name });
            if (!model) {
                model = await Model.create({ brand_id, name, priceAverage: p });
                created++;
            } else skipped++;
            modelMap[`${brandName}::${name}`] = { _id: model._id, brand_id };
        }
    }
    console.log(`[models] criados: ${created}, pulados: ${skipped}`);
    return { brandMap, modelMap };
}

async function seedCars(brandMap, modelMap) {
    let created = 0;
    const fuels = ['G', 'G', 'G', 'A', 'D']; // distribuição realista

    for (const [key, { _id: model_id, brand_id }] of Object.entries(modelMap)) {
        const existing = await Car.countDocuments({ model_id });
        if (existing > 0) continue;

        for (let year = 2018; year <= 2024; year++) {
            const fuel = fuels[Math.floor(Math.random() * fuels.length)];
            const basePrice = MODELS_BY_BRAND[key.split('::')[0]]
                ?.find(m => m.name === key.split('::')[1])?.p || 80000;
            const price = Math.round(basePrice * (0.85 + (year - 2018) * 0.05));
            await Car.create({ brand_id, model_id, year, price, fuel });
            created++;
        }
    }
    console.log(`[cars] criados: ${created}`);
}

async function seedCases(brandMap, modelMap) {
    const adminUser = await User.findOne({ username: 'admin' });
    const createdBy = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

    let created = 0, skipped = 0;
    for (const c of CASES_TEMPLATE) {
        const exists = await Case.findOne({ brand: c.brand, model: c.model, status: 'APPROVE' });
        if (exists) { skipped++; continue; }
        await Case.create({
            brand: c.brand, model: c.model,
            category: c.category, type: c.type,
            generalUse: c.generalUse, competence: c.competence,
            priceAverage: c.price, images: [], status: 'APPROVE',
            createdBy
        });
        created++;
    }
    console.log(`[cases] criados: ${created}, pulados: ${skipped}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function seed() {
    await mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
    console.log('Conectado ao banco\n');

    await seedCollection('fieldsPermissions', FieldsPermissions, FIELDS_PERMISSIONS, 'userRole');
    await seedCollection('attributes', Attribute, ATTRIBUTES, 'search');

    const { brandMap, modelMap } = await seedBrandsAndModels();
    await seedCars(brandMap, modelMap);
    await seedCases(brandMap, modelMap);

    await mongoose.disconnect();
    console.log('\nSeed completo!');
}

seed().catch(err => { console.error(err); process.exit(1); });
