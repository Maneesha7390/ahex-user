const express = require('express');
const userController = require('./user.controller');
const { validateUser } = require('./user.validator');

const router = express.Router();

router.post('/register', validateUser, userController.registerUser);
router.post('/signin', userController.signInUser);


module.exports = router;