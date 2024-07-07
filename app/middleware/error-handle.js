const logger = require('../shared/logger');
const sendResponse = require('../shared/send-response');
const NoResponseError = require('../shared/models/no-response-error.model');
const Status = require('../shared/models/status.model');

module.exports = function handleError(err, req, res, next) {
  logger.exception(err);
  if (err instanceof NoResponseError) {
    return;
  } else {
    if (req.audit) {
      req.audit.message += 'Message Logged: '+err.message || err.description;
      req.audit.stackError += err.stack;
      req.audit.status = AUDIT_STATUS.FAILED;
    }
    return sendResponse(req, res, next, {}, new Status(err.status || 500,
      err.message, err.description));
  }
};