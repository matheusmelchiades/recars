const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema(
    {
        'places': { type: String, required: true },
        'placeUsed': { type: String, required: true },
        'classUse': { type: String, required: true },
        'motor': { type: String, required: true },
        'priceMin': { type: Number, required: true },
        'priceMax': { type: Number, required: true },
        'user': {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = app => mongoose.model('searchs', SearchSchema);