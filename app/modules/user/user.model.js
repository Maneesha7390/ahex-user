const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const COLLECTIONS = require('../../shared/enums/collection-names');
const {connectionFactory} = require('../../shared/mongo-connection-factory');
const bcrypt = require('bcrypt');

module.exports = function model() {
    return connectionFactory().model(COLLECTIONS.USERS, userSchema, COLLECTIONS.USERS)
  };

const userSchema = new Schema({
  firstName: { type: String},
  lastName: { type: String},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true  },
  phoneNumber: { type: String,  unique: true},
  emailVerification: { type: Boolean, default: false },
  phoneVerification: { type: Boolean, default: false },
  smsOTP: { type: String, default: '' },
  smsOTPExpiration: { type: Number, default: null },
  emailOTP: { type: String , default: ''},
  emailOTPExpiration: { type: Number, default: null},
  createdAt:Number,
  updatedAt: Number,
  createdBy: String,
  updatedBy: String,
}, { timestamps: true, versionKey: false, strict: true });


userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});