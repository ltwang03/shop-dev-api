'use strict';

const { findApiKey } = require('../services/apikey.service');
const { ForbiddenRequestError } = require('../core/error.response');

const headers = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[headers.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden access',
      });
    }
    // check key in db
    const objKey = await findApiKey(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden access',
      });
    }
    req.objKey = objKey;
    next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permission) {
      return res.status(403).json({
        message: 'Forbidden access',
      });
    }
    console.log('permission::', req.objKey.permission);
    const validPermission = req.objKey.permission.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'Forbidden access',
      });
    }
    return next();
  };
};

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

module.exports = { apiKey, permission, asyncHandler };
