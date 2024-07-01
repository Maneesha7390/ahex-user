const userService = require('./user.service');

const registerUser = async (req, res) => {
    try {
        const newUser = await userService.registerUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const signInUser = async (req, res) => {
    try {
        const user = await userService.signInUser(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = {
    registerUser,
    signInUser
};
