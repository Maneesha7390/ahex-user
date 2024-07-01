const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('../app/modules/user/user.route');

const createServer = ({ dbUri }) => {
    const app = express();
    app.use(bodyParser.json());

    mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    app.use('/api/users', userRoutes);

    return app;
};

module.exports = createServer;
