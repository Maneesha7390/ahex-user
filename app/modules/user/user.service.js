const User = require('./user.model');

const registerUser = async (userData) => {
    const { email } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
};

module.exports = {
    registerUser
};
