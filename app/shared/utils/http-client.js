'use strict';
const axios = require('axios').default;
const ServerError = require('../models/server-error.model');
const STATUS = require('../enums/response-status');
const logger = require('../logger');


/**
 * 
 */
class HttpClient {
  /**
   * 
   * @param {*} config 
   */
  constructor(config) {
    this.name = config.name;
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      responseType: config.responseType,
      timeoutErrorMessage: config.timeoutErrorMessage,
        
    });
  }

  /**
   * 
   * @param {*} url 
   * @param {*} data 
   * @param {*} config 
   */
  async post(url, data, config) {
    try {
      const response = await this.instance.post(url, data, config);
      return this.getResponseData(response);
    } catch (err) {
      if (!err.response) {
        logger.exception(err);
        throw new ServerError(501, `Error connecting to ${this.name}`, err.message);
      }
      throw err;
    }
  }

  /**
   * 
   * @param {*} url 
   * @param {*} config 
   */
  async get(url, config) {
    try {
      const response = await this.instance.get(url, config);
      return this.getResponseData(response);
    } catch (err) {
      if (!err.response) {
        logger.exception(err);
        throw new ServerError(501, `Error connecting to ${this.name}`, err.message);
      }
      throw err;
    }
  }
  
  
  /**
   * 
   * @param {*} response 
   * @return {Object} data from service
   */
  getResponseData(response) {
    if (response.data && response.data.status && response.data.status.type == STATUS.SUCCESS) {
      return response.data.data;
    } else if (response.data.status && response.data.status.type == STATUS.ERROR) {
      throw new ServerError(response.data.status.code, response.data.status.message, response.data.status.description);
    } else {
      throw new ServerError(500, `Error connecting to service ${this.name}`);
    }
  }
}


module.exports = HttpClient;
 