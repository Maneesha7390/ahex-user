const express = require('express');
const userController = require('./user.controller');
const { validateUser, emailVerificationStatus, phoneNumberVerificationStatus } = require('./user.controller');

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/verify/email-otp', emailVerificationStatus, userController.verifyOtpViaEmail)
router.post('/resend/email-otp', validateUser, userController.resendOtpViaEmail)
router.post('/verify/sms-otp',  phoneNumberVerificationStatus, userController.verifyOtpViaSMS)
router.post('/resend/sms-otp', validateUser,userController.resendOtpViaSMS)
router.post('/signin', validateUser, userController.signInUser);

module.exports = router;