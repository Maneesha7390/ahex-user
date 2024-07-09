const User = require('./user.model');
const moment = require('moment')
let timeNow = moment().unix()
const ClientError = require('../../shared/models/client-error.model');
const ServerError = require('../../shared/models/server-error.model');
const ERROR_MESSAGES = require('../../shared/error-messages');
const logger = require('../../shared/logger');

const registerUser = async (userData) => {
    let framedData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        createdAt: timeNow,
        updatedAt: timeNow,
        createdBy: userData.firstName+' '+userData.lastName,
        password: userData.password,
        picture: userData.picture || '',
        provider: userData.provider || ''
    }
    const newUser = new User()(framedData);
    await newUser.save();
    return newUser;
};

async function uniqueUserCheck(email) {
    const result = await User().findOne({email}).lean();
    if (result) {
        return false;
    } else {
        return true;
    }
  }

async function updateOTPs(email, otp, key){
    const response = await User().updateOne({email}, {[`${key}OTP`]: otp, [`${key}OTPExpiration`]: moment().add(10, 'minutes').valueOf(), updateAt: timeNow, updateBy: email})
}

async function verifyOTPViaEmail(email, OTP){
    try{
        const user = await User().findOne({
            email: email,
            emailOTP: OTP
          });

        if (!user) {
            throw new ClientError(400, 'Invalid OTP', '');
        }

        if (user.emailOTPExpiration < moment().subtract(10, 'minutes').valueOf()) {
            throw new ClientError(400, 'Expired OTP', '');
        }
        user.emailVerification = true
        user.emailOTP = null
        user.emailOTPExpiration = null
        user.updatedBy = email
        const savedUser = await user.save()
        return savedUser
    }catch (ex) {
        if (ex instanceof ClientError) {
          throw ex;
        }
        logger.exception(ex);
        throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
      }
}

async function verifyOTPViaSMS(email, phoneNumber, OTP){
    try{
        const user = await User().findOne({
            email,
            phoneNumber,
            smsOTP: OTP
          });

        if (!user) {
            throw new ClientError(400, 'Invalid OTP', '');
        }
        if (user.smsOTPExpiration < moment().subtract(10, 'minutes').valueOf()) {
            throw new ClientError(400, 'Expired OTP', '');
        }
        user.phoneVerification = true
        user.smsOTP = null
        user.smsOTPExpiration = null
        user.updatedBy = email
        const savedUser = await user.save()
        return savedUser
    }catch (ex) {
        if (ex instanceof ClientError) {
          throw ex;
        }
        logger.exception(ex);
        throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
      }
}

async function findUser(email){
    let response = await User().findOne({email}).lean()
    return response
}

async function updateProvider(email, provider, picture){
    const response = await User().updateOne({email}, {provider, picture, googleSSO: true, updatedAt: timeNow, updatedBy: email}, {upsert:true})
}

module.exports = {
    registerUser,
    uniqueUserCheck,
    updateOTPs,
    verifyOTPViaEmail,
    verifyOTPViaSMS,
    findUser,
    updateProvider
};
