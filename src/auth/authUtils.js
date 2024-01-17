'use strict';
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const headers = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id',
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });
    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log(`error verify access token: ${err}`);
      } else {
        console.log(`decoded access token:`, decoded);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[headers.CLIENT_ID]?.toString();
  console.log('userId', userId);
  if (!userId) {
    throw new AuthFailureError('Authentication failure');
  }
  const keyStore = await findByUserId(userId);
  console.log('key store', keyStore);
  if (!keyStore) {
    throw new NotFoundError('Key store not found');
  }
  const accessToken = req.headers[headers.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError('Authentication failure');
  }
  try {
    const decoded = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decoded.userId) {
      throw new AuthFailureError('Authentication failure');
    }
    req.keyStore = keyStore;
    req.user = decoded;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[headers.CLIENT_ID]?.toString();
  console.log('userId', userId);
  if (!userId) {
    throw new AuthFailureError('Authentication failure');
  }
  const keyStore = await findByUserId(userId);
  console.log('key store', keyStore);
  if (!keyStore) {
    throw new NotFoundError('Key store not found');
  }
  const refreshToken = req.headers[headers.REFRESHTOKEN];
  if (!refreshToken) {
    throw new AuthFailureError('Authentication failure');
  }
  try {
    const decoded = JWT.verify(refreshToken, keyStore.privateKey);
    if (userId !== decoded.userId) {
      throw new AuthFailureError('Authentication failure');
    }
    req.keyStore = keyStore;
    req.user = decoded;
    req.refreshToken = refreshToken;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyToken = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyToken,
};
