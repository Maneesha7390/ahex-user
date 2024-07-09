const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const logger = require('../shared/logger');
const mongoConnectionFactory = require('../shared/mongo-connection-factory');
const timeout = require('connect-timeout');
const moment = require('moment');
const passport = require('../shared/passport');
const dotenv = require('dotenv')
const session = require('express-session')
dotenv.config()
/**
 *
 * @param {*} app
 */
module.exports = async function init(app) {
  const timeoutOptions = {
    respond: false,
  };
  const commandTimeout =90;
  if (commandTimeout) app.use(timeout(commandTimeout, timeoutOptions));

  mongoConnectionFactory.connect();
  
  morgan.token('time', (req) => {
    return moment().toLocaleString();
  })

  app.use(morgan(':time | :method :url :status :response-time ms'));
  app.use(cors());
  app.use(helmet());
  app.use((req,res,next)=>{
    if(mongoConnectionFactory.isReady()==false) throw new Error('Server is not available');
    next();
  });
  app.use(bodyParser.json({limit: '100mb'}));
  app.use(bodyParser.urlencoded({limit: '1mb', extended: false}));
  app.use(fileUpload({debug: false}));
  app.use(session({ secret: process.env.SESSION_SECRET_KEY, resave: false, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  process.on('uncaughtException', (ex) => {
    logger.exception(ex);
  });

  process.on('unhandledRejection', (ex) => {
    logger.exception(ex);
  });
};
