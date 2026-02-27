const { azure } = require('../services/APIs');

module.exports = (app) => {
    const { url, key } = app.config.system.integrations.azure;
    const API = azure(url, key);

    const searchImages = async (search) => {
        try {
            const response = await API.get(`?q=${search}&count=30`);

            if (response.status !== 200) return [];
            return response.data;
        } catch (err) {
            console.log('Error azure integration');
        }
    };

    return { searchImages };
};