require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const config = require('../config/system')().db;

const uri = config.user
    ? `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=admin`
    : `mongodb://${config.host}:${config.port}/${config.database}`;

const Case = mongoose.model('cases', new mongoose.Schema({
    model: String, brand: String, images: Array, status: String
}, { strict: false }));

async function fetchWikipediaImage(brand, model) {
    try {
        const query = `${brand} ${model} car`;
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
            headers: { 'User-Agent': 'RecarsApp/1.0' },
            params: {
                action: 'query',
                generator: 'search',
                gsrsearch: query,
                prop: 'pageimages',
                piprop: 'thumbnail',
                pithumbsize: 400,
                pilimit: 5,
                format: 'json',
                origin: '*'
            }
        });

        const pages = response.data.query?.pages || {};
        const images = Object.values(pages)
            .filter(page => page.thumbnail)
            .map(page => ({
                _id: String(page.pageid),
                name: page.title,
                url: page.thumbnail.source,
                format: 'jpg'
            }));

        return images.length > 0 ? [images[0]] : [];
    } catch (err) {
        console.log(`  Erro ao buscar imagem para ${brand} ${model}: ${err.message}`);
        return [];
    }
}

async function main() {
    await mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
    console.log('Conectado ao banco\n');

    const cases = await Case.find({ status: 'APPROVE' });
    console.log(`Encontrados ${cases.length} cases aprovados\n`);

    let updated = 0;
    for (const c of cases) {
        if (c.images && c.images.length > 0) {
            console.log(`  ${c.brand} ${c.model} — já tem imagem, pulando`);
            continue;
        }

        const images = await fetchWikipediaImage(c.brand, c.model);
        if (images.length > 0) {
            await Case.updateOne({ _id: c._id }, { $set: { images } });
            console.log(`  ${c.brand} ${c.model} — imagem adicionada (${images[0].name})`);
            updated++;
        } else {
            console.log(`  ${c.brand} ${c.model} — nenhuma imagem encontrada`);
        }

        // Pequeno delay para não sobrecarregar a API da Wikipedia
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n${updated} cases atualizados com imagens`);
    await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
