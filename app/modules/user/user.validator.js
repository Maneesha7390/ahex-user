const Joi = require('joi')

module.exports ={
    validateRegisterUser,
    validateLoginUser,
    validateOTPViaEmail,
    validatResendEmailOTP,
    validateOTPViaPhoneNumber,
    validatResenSMSOTP,
    validateSignIn
}

function validateRegisterUser(requestBody){
    return registerUser.validate(requestBody, {abortEarly: false});
}

function validateLoginUser(requestBody){
    return validateLoggedinUser.validate(requestBody, {abortEarly: false})
}

function validateOTPViaEmail(requestBody){
  return validateEmailOTP.validate(requestBody, {abortEarly: false})
}

function validatResendEmailOTP(reqBody){
  return validateResendEmail.validate(reqBody, {abortEarly: false})
}

function validateOTPViaPhoneNumber(reqBody){
  return validateSMSOTP.validate(reqBody, {abortEarly: false})
}

function validatResenSMSOTP(reqBody){
  return validateResendSMS.validate(reqBody, {abortEarly: false})
}

function validateSignIn(reqBody){
  return validateLoggedinUser.validate(reqBody, {abortEarly: false})
}

const registerUser = Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email field is required'
      }),
    firstName: Joi.string().min(3).max(30).required().messages({
        'string.min': 'firstName must be at least 3 characters long',
        'string.max': 'firstName must be at most 12 characters long',
        'any.required': 'firstName field is required'
      }),
    lastName: Joi.string().min(3).max(30).required().messages({
        'string.min': 'lastName must be at least 3 characters long',
        'string.max': 'lastName must be at most 12 characters long',
        'any.required': 'lastName field is required'
      }),  
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@!#$%^&*_-]{6,30}$')).required().messages({
          'string.pattern.base': 'Password must be between 6 to 30 characters and contain only @, letters, numbers, and special characters: !#$%^&*_-',
          'any.required': 'Password field is required'
      }),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'string.pattern.base': 'Phone number must be a valid 10-digit number.',
      'string.empty': 'Phone number cannot be empty.',
      'any.required': 'Phone number is required.'
    })
  })

const validateLoggedinUser = Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email field is required'
      }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@!#$%^&*_-]{6,30}$')).required().messages({
        'string.pattern.base': 'Password must be between 6 to 30 characters and contain only @, letters, numbers, and special characters: !#$%^&*_-',
        'any.required': 'Password field is required'
    }),
})

const validateEmailOTP = Joi.object().keys({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email field is required'
  }),
  emailOTP: Joi.string().length(6).required().messages({
    'string.base': 'Email OTP should be a type of text',
    'string.length': 'Email OTP must be exactly 6 digits',
    'any.required': 'Email OTP is required'
  }),
})

const validateResendEmail = Joi.object().keys({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email field is required'
  })})

const validateResendSMS = Joi.object().keys({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email field is required'
  }),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be a valid 10-digit number.',
    'string.empty': 'Phone number cannot be empty.',
    'any.required': 'Phone number is required.'
  })
})

const validateSMSOTP = Joi.object().keys({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email field is required'
  }),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be a valid 10-digit number.',
    'string.empty': 'Phone number cannot be empty.',
    'any.required': 'Phone number is required.'
  }),
  smsOTP: Joi.string().length(6).required().messages({
    'string.base': 'SMS OTP should be a type of text',
    'string.length': 'SMS OTP must be exactly 6 digits',
    'any.required': 'SMS OTP is required'
  })
})
