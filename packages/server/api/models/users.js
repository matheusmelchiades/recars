const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const systemConfig = require('../../config/system')();
const time = require('../../helper/time');
const encryption = require('../../helper/encryption');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['ADMIN', 'HELPER', 'USER'],
            default: 'USER'
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {
    this.password = await encryption.encrypt(this.password);
    next();
});

UserSchema.statics.getToken = function ({ username, password }) {
    return new Promise((resolve, reject) => {
        this.findOne({ username }, async (err, user) => {
            if (err) return reject(err);
            if (!user) return resolve(false);
            if (!(await encryption.check(password, user.password))) return resolve(user);

            return resolve({
                username: user.username,
                token: jwt.encode({
                    _id: user._id,
                    expirate: time.addMinutes(new Date(), systemConfig.timeExpirateToken)
                }, systemConfig.authSecret)
            });
        });
    });
};

module.exports = (app) => mongoose.model('users', UserSchema);
