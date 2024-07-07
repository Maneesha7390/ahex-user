'use strict';
const ERROR_MESSAGES = require('../error-messages');

/**
 * 
 */
class NoResponseError extends Error {
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

module.exports = NoResponseError;
