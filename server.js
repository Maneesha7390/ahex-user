const express = require('express');
const app = express();
const logger = require('./app/shared/logger')
const errorHandler = require('./app/middleware/error-handle');
const init = require('./app/startup/init');
require('express-async-errors');
const PORT = process.env.PORT || 5000;
const userRoutes = require('./app/modules/user/user.route');

startup().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
}, (err) => {
    logger.error(`Error starting the service on port ${PORT}`);
    logger.exception(err);
    process.exit(0);
});


async function startup() {
    await init(app);
    await require('./app/startup/routes/portal')(app);
    app.use('/api/users', userRoutes);
    app.use(errorHandler);;
}

function registerUser(app) {
    app.post('/register', (req, res, next) => userRoutes.handle(req, res, next));
}

function inviteUser(app) {
    app.post('/invite', (req, res, next) => userRoutes.handle(req, res, next));
}

function verifyViaOTP(app) {
    app.post('/verify/email-otp', (req, res, next) => userRoutes.handle(req, res, next));
}

function verifyViaSMS(app) {
    app.post('/verify/sms-otp', (req, res, next) => userRoutes.handle(req, res, next));
}

function resendVerifyEmail(app) {
    app.post('/resend/email-otp', (req, res, next) => userRoutes.handle(req, res, next));
}

function resendVerifySMS(app) {
    app.post('/resend/sms-otp', (req, res, next) => userRoutes.handle(req, res, next));
}

module.exports = {
    startup,
    registerUser,
    inviteUser,
    verifyViaOTP,
    verifyViaSMS,
    resendVerifyEmail,
    resendVerifySMS
};