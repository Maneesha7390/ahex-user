const axios = require('axios');
const createServer = require('./lib/server');

let serverInstance;

const startServer = (dbUri, port = 3000) => {
    const app = createServer({ dbUri });
    serverInstance = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

const stopServer = () => {
    if (serverInstance) {
        serverInstance.close();
    }
};

const createNewUser = async (userData, port = 3000) => {
    try {
        const response = await axios.post(`http://localhost:${port}/api/users/register`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};

const signInUser = async (userData, port = 3000) => {
    try {
        const response = await axios.post(`http://localhost:${port}/api/users/signin`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};

module.exports = {
    startServer,
    stopServer,
    createNewUser,
    signInUser
};
