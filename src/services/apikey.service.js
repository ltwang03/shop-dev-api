const apikeyModel = require('../models/apikey.model');
const crypto = require('node:crypto');
const findApiKey = async (apiKey) => {
  //   const newKey = await apikeyModel.create({
  //     key: crypto.randomBytes(16).toString('hex'),
  //     permission: ['0000'],
  //   });
  //   console.log(newKey);
  const objKey = await apikeyModel
    .findOne({ key: apiKey, status: true })
    .lean();
  return objKey;
};

module.exports = { findApiKey };
