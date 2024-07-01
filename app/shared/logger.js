const moment = require('moment');
const winstonLogger = require('./logger.winston');

exports.error = error;
exports.warn = warn;
exports.debug = debug;
exports.info = info;
exports.exception = exception;

/**
 * 
 * @param {*} message 
 */
async function info(message) {
  message = ` ${moment.utc()} | ${message}`;
  console.info(message);
  winstonLogger.info(message);
};

/**
 * 
 * @param {*} message 
 */
async function debug(message) {
  message = ` ${moment.utc()} |  ${message}`;
  console.debug(message);
  winstonLogger.debug(message);
};

/**
 * 
 * @param {*} message 
 */
async function warn(message) {
  message = `${moment.utc()} |  ${message}`;
  console.warn(message);
  winstonLogger.warn(message);
};

/**
 * 
 * @param {*} message 
 */
async function error(message) {
  message = ` ${moment.utc()} |  ${message}`;
  console.error(message);
  winstonLogger.error(message);
};

/**
 * 
 * @param {*} ex 
 * @param {*} req 
 */
async function exception(ex, req) {
  const message = ` message:${ex.message} |description : ${ex.description} | stacktrace: ${ex.stack}`;
  error(`${message}`);
  winstonLogger.error(message);
};
