const ApiError = require("../exceptions/apiError.js");
const TokenService = require("../services/tokenService");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.AnauthorizedError());
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(ApiError.AnauthorizedError());
    }

    let userData = TokenService.validateAccessToken(token);
    if (!userData) {
      userData = TokenService.validateRefreshToken(token);

      if (!userData) {
        return next(ApiError.AnauthorizedError());
      }
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.AnauthorizedError());
  }
};
