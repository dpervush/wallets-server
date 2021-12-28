const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { User, Account, AccountCards } = require("../models/index");
const TokenService = require("./tokenService");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/apiError");

class UserService {
  async register(firstName, secondName, email, password) {
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();
    const user = await User.create({
      email,
      password: hashedPassword,
      activationLink,
      firstName,
      secondName
    });
    const account = await Account.create({ userId: user.id });

    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto, accountId: account.id }
    };
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }

    const account = await Account.findOne({ where: { userId: user.id } });
    if (!account) throw ApiError.BadRequest("Аккаунт не найден");

    const userDto = new UserDto(user);

    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveToken(user.id, tokens.refreshToken);
    return { ...tokens, user: { ...userDto, accountId: account.id } };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async getMe(refreshToken) {
    if (!refreshToken) {
      throw ApiError.AnauthorizedError();
    }

    const userData = TokenService.validateRefreshToken(refreshToken);

    const token = await TokenService.findToken(refreshToken);

    if (!userData || !token) {
      throw ApiError.AnauthorizedError();
    }

    const { dataValues: user } = await User.findByPk(userData.id, {
      attributes: [
        "id",
        "email",
        "firstName",
        "secondName",
        "isActivated",
        "activationLink"
      ]
    });

    const account = await Account.findOne({
      where: { userId: user.id }
    });
    if (!account) throw ApiError.BadRequest("Аккаунт не найден");

    return { currentUser: { ...user, accountId: account.id } };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.AnauthorizedError();
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const token = await TokenService.findToken(refreshToken);

    if (!userData || !token) {
      throw ApiError.AnauthorizedError();
    }

    const user = await User.findByPk(userData.id);

    const userDto = new UserDto(user);

    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();
