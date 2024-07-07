const userRoute = require('../../modules/user/user.route')


module.exports = async function(app){
    app.use('/api/user', userRoute)
}