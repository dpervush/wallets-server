const jsonwebtoken = require("jsonwebtoken");
const { Token } = require("../models");

class TokenService {
  generateToken(payload) {
    const accessToken = jsonwebtoken.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "24h",
      }
    );
    const refreshToken = jsonwebtoken.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "10d",
      }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jsonwebtoken.verify(
        token,
        process.env.JWT_ACCESS_SECRET
      );

      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jsonwebtoken.verify(
        token,
        process.env.JWT_REFRESH_SECRET
      );
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    console.log(userId);

    const tokenData = await Token.findOne({ userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await Token.create({ userId, refreshToken });
    return token;
  }

  async removeToken(token) {
    const userToken = await Token.findOne({
      where: { refreshToken: token },
    });

    return await userToken
      .destroy()
      .then(() => "ok")
      .catch(() => "error");
  }

  async findToken(token) {
    const tokenData = await Token.findOne({ token });

    return tokenData.dataValues;
  }
}

module.exports = new TokenService();
