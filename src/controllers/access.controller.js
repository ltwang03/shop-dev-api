const AccessService = require('../services/access.service');

const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Refresh token successfully',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  signIn = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Sign up successfully',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AccessController();
