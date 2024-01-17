const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyToken } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenRequestError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
  SHOP: '01',
  WRITER: '02',
  EDITER: '03',
};

class AccessService {
  static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenRequestError('Something went wrong! Pls login again');
    }

    if (keyStore.refreshToken != refreshToken) {
      throw new BadRequestError('Shop not found');
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError('Shop not found');
    }
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keyStore.updateOne({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: { refreshTokensUsed: refreshToken },
    });
    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  };

  static signIn = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError('Shop not found');
    }
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Authentication failure');
    }
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new ConflictRequestError('Email already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      //create public key and private key
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new ConflictRequestError('Key store error');
      }
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 'xxx',
      metadata: null,
    };
  };
}

module.exports = AccessService;
