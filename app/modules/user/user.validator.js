const Joi = require('joi');


exports.validateUser = validateUser;
/**
 * 
 * @param {*} user 
 * @returns 
 */

function validateUser(user) {
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      mobileNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().email().required(),
    });
    return schema.validate(user);
  }