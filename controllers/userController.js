const UserService = require("../services/userService");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/apiError.js");
const getValueFromCookie = require("../utils/getValueFromCookie.js");

class UserController {
  async register(req, res, next) {
    // todo: пихать в cookie актуальный accountId

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }

      const { firstName, secondName, email, password } = req.body;
      const userData = await UserService.register(
        firstName,
        secondName,
        email,
        password
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const userData = await UserService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.cookie("accountId", userData.user.accountId, {
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = getValueFromCookie(
        "refreshToken",
        req.headers.cookie
      );
      const token = await UserService.logout(refreshToken);

      res.clearCookie("refreshToken");
      res.clearCookie("accountId");

      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async getMe(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const refreshToken = authHeader.split(" ")[1];

      const userData = await UserService.getMe(refreshToken);

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = getValueFromCookie(
        "refreshToken",
        req.headers.cookie
      );

      const userData = await UserService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
