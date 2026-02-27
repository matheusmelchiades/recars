const axios = require('axios');

module.exports = {
    azure: (url, key) => {
        return axios.create({
            baseURL: url,
            headers: {
                'Ocp-Apim-Subscription-Key': key
            }
        });
    }
};