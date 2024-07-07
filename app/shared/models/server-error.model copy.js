'use strict';
/**
 * use this error for any errors which occured due to code failures and a response needs to be sent.
 * these errors will be logged and response will be sent to client
 */
const ERROR_MESSAGES = require('../error-messages');

/**
 *
 */
class ServerError extends Error {
  /**
     *
     * @param {*} status
     * @param {*} message
     * @param {*} description
     */
  constructor(status = 500, message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR_500,
    description = ERROR_MESSAGES.CONTACT_ADMINSTRATOR) {
    super(message);
    this.message = message;
    this.status = status;
    this.description = description;
  }
}

module.exports = ServerError;
