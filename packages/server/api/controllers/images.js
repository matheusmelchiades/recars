module.exports = (app) => {

    const model = app.api.models.azure;

    const searchImage = async (req, res) => {
        try {
            const { search } = req.query;
            const User = req.user;

            if (User.role === 'USER') return res.status(400).send('Unauthorized');

            if (!search) return res.status(400).send('Params Invaid!');

            const dataImagesResp = await model.searchImages(search);

            if (!dataImagesResp || !dataImagesResp.value) return res.status(400).send('Error request integration');

            const images = dataImagesResp.value.map((img) => ({
                _id: img.imageId,
                name: img.name,
                url: img.thumbnailUrl,
                format: img.encodingFormat
            }));

            return res.status(200).send(images);
        } catch (err) {
            console.log(err);
        }
    };

    return { searchImage };
};