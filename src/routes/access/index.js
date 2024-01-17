const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/signin', asyncHandler(accessController.signIn));

router.use(authenticationV2);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post(
  '/shop/refresh-token',
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
