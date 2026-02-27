const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const CasesSchema = new mongoose.Schema(
    {
        'model': { type: String, required: true },
        'brand': { type: String, required: true },
        'category': { type: String, required: true },
        'type': { type: String, required: true },
        'generalUse': { type: String, required: true },
        'competence': { type: String, required: true },
        'priceAverage': { type: Number, required: true },
        'images': Array,
        'status': {
            type: String,
            enum: ['PENDING', 'HOMOLOG', 'DELETED', 'APPROVE'],
            default: 'PENDING'
        },
        'quantity': {
            type: Number,
            default: 1
        },
        'createdBy': {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

CasesSchema.statics.createCase = function (oneCase) {
    return new Promise((resolve, reject) => {
        const images = oneCase.images;
        delete oneCase.images;

        this.findOne(oneCase, (err, caseDb) => {
            if (err) return reject(err);

            if (!caseDb) {
                this.create({ ...oneCase, images }, (err, caseCreated) => {
                    if (err) return reject(err);

                    return resolve(caseCreated);
                });
            } else {
                this.update({ _id: ObjectId(caseDb._id) },
                    {
                        '$set': {
                            'quantity': caseDb.quantity + 1,
                            'status': 'PENDING'
                        }
                    },
                    { upsert: true }, (err, caseUpdated) => {
                        if (err) return reject(err);
                        return resolve(caseUpdated);
                    }
                );
            }
        });
    });
};

CasesSchema.statics.findPending = function () {
    return this.find({ status: { $in: ['PENDING', 'HOMOLOG'] } }).populate('createdBy', { _id: 1, username: 1 });
};

CasesSchema.statics.findPendingByHelper = function (username) {
    return this.aggregate([
        { '$match': { 'status': 'PENDING' } },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'createdBy',
                'foreignField': '_id',
                'as': 'createdBy'
            }
        },
        { '$unwind': '$createdBy' },
        { '$match': { 'createdBy.username': username } }
    ]);
};

CasesSchema.statics.findCases = function () {
    return this.find({ 'status': { '$in': ['APPROVE', 'DELETED'] } }).populate('createdBy', { _id: 1, username: 1 });
};

CasesSchema.statics.ApprovePendencies = function (pendencies) {

    const query = {
        '_id': {
            '$in': pendencies.map((casePend) => ObjectId(casePend._id))
        }
    };

    return this.updateMany(query, { '$set': { status: 'APPROVE' } }, { upsert: true });
};

CasesSchema.statics.ApprovePendenciesByHelper = function (pendencies) {

    const query = {
        '_id': {
            '$in': pendencies.map((casePend) => ObjectId(casePend._id))
        }
    };

    return this.updateMany(query, { '$set': { status: 'HOMOLOG' } }, { upsert: true });
};

CasesSchema.statics.deleteCases = function (cases) {

    const query = {
        '_id': {
            '$in': cases.map((aCase) => ObjectId(aCase._id))
        }
    };

    return this.updateMany(query, { '$set': { status: 'DELETED' } }, { upsert: true });
};

CasesSchema.statics.findBeetweenPrices = function (min, max) {
    return this.find({
        'status': 'APPROVE',
        'priceAverage': {
            '$gt': parseInt(min),
            '$lt': parseInt(max)
        }
    });
};

module.exports = app => mongoose.model('cases', CasesSchema);