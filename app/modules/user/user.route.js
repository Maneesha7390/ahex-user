const express = require('express');
const userController = require('./user.controller');
const { validateUser, emailVerificationStatus, phoneNumberVerificationStatus } = require('./user.controller');
const passport = require('passport')
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/verify/email-otp', emailVerificationStatus, userController.verifyOtpViaEmail)
router.post('/resend/email-otp', validateUser, userController.resendOtpViaEmail)
router.post('/verify/sms-otp',  phoneNumberVerificationStatus, userController.verifyOtpViaSMS)
router.post('/resend/sms-otp', validateUser,userController.resendOtpViaSMS)
router.post('/signin', validateUser, userController.signInUser);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/users/failure', successRedirect: '/api/users/success' }))
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/api/users/failure', successRedirect: '/api/users/success' }))
router.get('/success', userController.sucessPage)
router.get('/failure', userController.failurePage)


module.exports = router;