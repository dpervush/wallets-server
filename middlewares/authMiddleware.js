const ApiError = require("../exceptions/apiError.js");
const getValueFromCookie = require("../utils/getValueFromCookie.js");

const TokenService = require("../services/tokenService");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.AnauthorizedError());
    }

    const token = getValueFromCookie("refreshToken", req.headers.cookie);
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
