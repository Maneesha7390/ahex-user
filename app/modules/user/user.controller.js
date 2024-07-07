const userService = require('../user/user.service');
const ClientError = require('../../shared/models/client-error.model');
const ServerError = require('../../shared/models/server-error.model');
const ERROR_MESSAGES = require('../../shared/error-messages');
const sendResponse = require('../../shared/send-response');
const logger = require('../../shared/logger');
const userValidator = require('./user.validator');
const jwt = require('jsonwebtoken');
const {generateOtp, sendOTPviaEmail, sendOTPviaSms, sendLoginFailedMail, sendLoginEmail } = require('../../shared/utils/userEmail');
const Status = require('../../shared/models/status.model');
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')


module.exports = {
  registerUser,
  validateUser,
  verifyOtpViaEmail,
  resendOtpViaEmail,
  verifyOtpViaSMS,
  resendOtpViaSMS,
  emailVerificationStatus,
  phoneNumberVerificationStatus,
  signInUser
};

async function registerUser(req, res, next) {
  try {
    let reqBody = req.body;
    const { error } = userValidator.validateRegisterUser({ ...reqBody});
    let {firstName, email, phoneNumber, password} = reqBody
    if (error) {
      let summaryMessage = '';
      error.details.forEach((err) => {
        summaryMessage += err.message;
      });
      throw new ClientError(400, summaryMessage);
    }
    const userExists = await userService.uniqueUserCheck(reqBody.email);
    if (!userExists) {
      throw new ClientError(400, 'Email already in use', '');
    }
    let emailOTP = ''
    let smsOTP = ''
    const response = await userService.registerUser({ ...reqBody});
    if(response && email){
      emailOTP = generateOtp()
      await sendOTPviaEmail(email, emailOTP, firstName)
      await userService.updateOTPs(email, emailOTP, 'email')
    }
    if (response && phoneNumber){
      smsOTP = generateOtp()
      await sendOTPviaSms( phoneNumber, smsOTP, firstName)
      await userService.updateOTPs(email, smsOTP, 'sms')
    }
    return sendResponse(req, res, next, { id: response._id.toString(), email }, new Status(201, "User registration successful", ''));

  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function validateUser(req, res, next) {
  try {
    let reqBody = req.body;
    const user = await userService.findUser(reqBody.email);
    if (!user) {
      throw new ClientError(400, "user Doesn't exist", '');
    }
    req.user=user;
    next();  
  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function emailVerificationStatus(req, res, next) {
  try {
    let reqBody = req.body;
    const user = await userService.findUser(reqBody.email);
    if (user.emailVerification) {
      throw new ClientError(400, "Email Verification Already Done", '');
    }
    req.user=user;
    next();  
  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function phoneNumberVerificationStatus(req, res, next) {
  try {
    let reqBody = req.body;
    const user = await userService.findUser(reqBody.email);
    if (user.phoneVerification) {
      throw new ClientError(400, "PhoneNumber Verification Already Done", '');
    }
    req.user=user;
    next();  
  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function verifyOtpViaEmail(req, res, next){
  try {
    let reqBody = req.body;
    let {email, emailOTP} = reqBody
    const { error } = userValidator.validateOTPViaEmail({ ...reqBody});
    if (error) {
      let summaryMessage = '';
      error.details.forEach((err) => {
        summaryMessage += err.message;
      });
      throw new ClientError(400, summaryMessage);
    }
    const response = await userService.verifyOTPViaEmail(email, emailOTP);
    return sendResponse(req, res, next, { id: response._id.toString(), email }, new Status(200, "Email Verification successful", ''));
  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function resendOtpViaEmail(req, res, next){
  try {
    let reqBody = req.body;
    let {email} = reqBody
    let {firstName} = req.user
    const { error } = userValidator.validatResendEmailOTP({ ...reqBody});
    if (error) {
      let summaryMessage = '';
      error.details.forEach((err) => {
        summaryMessage += err.message;
      });
      throw new ClientError(400, summaryMessage);
    }
    if(email){
      emailOTP = generateOtp()
      await sendOTPviaEmail(email, emailOTP, firstName)
      await userService.updateOTPs(email, emailOTP, 'email')
    }
    return sendResponse(req, res, next, { }, new Status(200, "OTP Sent to the Registered Email Successfully", ''));
  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function verifyOtpViaSMS(req, res, next){
  try {
    let reqBody = req.body;
    let {email, phoneNumber, smsOTP} = reqBody
    const { error } = userValidator.validateOTPViaPhoneNumber({ ...reqBody});
    if (error) {
      let summaryMessage = '';
      error.details.forEach((err) => {
        summaryMessage += err.message;
      });
      throw new ClientError(400, summaryMessage);
    }
    const response = await userService.verifyOTPViaSMS(email, phoneNumber, smsOTP);
    return sendResponse(req, res, next, { id: response._id.toString(), email, phoneNumber }, new Status(200, "Phone Number Verified Successfully", ''));
  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function resendOtpViaSMS(req, res, next){
  try {
    let reqBody = req.body;
    let {phoneNumber, email} = reqBody
    let {firstName} = req.user
    const { error } = userValidator.validatResenSMSOTP({ ...reqBody});
    if (error) {
      let summaryMessage = '';
      error.details.forEach((err) => {
        summaryMessage += err.message;
      });
      throw new ClientError(400, summaryMessage);
    }
    if(email){
      smsOTP = generateOtp()
      await sendOTPviaSms( phoneNumber, smsOTP, firstName)
      await userService.updateOTPs(email, smsOTP, 'sms')
    }
    return sendResponse(req, res, next, { }, new Status(200, "OTP Sent to the Registered PhoneNumber Successfully", ''));
  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function signInUser(req, res, next) {
  try {
    let reqBody = req.body;
    let {email, password } = reqBody
    let user = req.user
    const { error } = userValidator.validateSignIn({ ...reqBody});
    if (error) {
      let summaryMessage = '';
      error.details.forEach((err) => {
        summaryMessage += err.message;
      });
      throw new ClientError(400, summaryMessage);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      await sendLoginFailedMail(user.firstName, email);
      throw new ClientError(400, "Password is incorrect", 'Please Enter Correct password');
    }
    let jwtUser = {
      id: user._id.toString(),
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      emailVerification: user.emailVerification,
      phoneVerification: user.phoneVerification
    }
    const token = JWT.sign(jwtUser,process.env.JWT_SECRET,{ expiresIn: "1h" });
    res.header("auth-token", token)
    await sendLoginEmail(user.firstName, email);
    return sendResponse(req, res, next, jwtUser, new Status(200, "User LoggedIn successfully", ''));
  } catch (ex) {
    if (ex instanceof ClientError) {
      next(ex);
    }
    logger.exception(ex);
    throw new ServerError(500, ERROR_MESSAGES.REGISTER_USER_FAILED, ex.message);
  }
}

async function verifyUser(req, res) {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Here, you would normally update the user's status in your database
    // Assuming the user's status is updated successfully

    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
}
