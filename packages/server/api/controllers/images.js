const axios = require('axios');

module.exports = (app) => {

    const searchImage = async (req, res) => {
        try {
            const { search, branch } = req.query;

            if (!search) return res.status(400).send('Params Invalid!');

            const query = branch ? `${branch} ${search} car` : `${search} car`;

            const response = await axios.get('https://en.wikipedia.org/w/api.php', {
                headers: { 'User-Agent': 'RecarsApp/1.0' },
                params: {
                    action: 'query',
                    generator: 'search',
                    gsrsearch: query,
                    prop: 'pageimages',
                    piprop: 'thumbnail',
                    pithumbsize: 300,
                    pilimit: 30,
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

            return res.status(200).send(images);
        } catch (err) {
            console.log(err);
            return res.status(400).send([]);
        }
    };

    return { searchImage };
};
