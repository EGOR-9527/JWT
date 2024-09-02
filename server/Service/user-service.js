require('dotenv').config();
const { UserBase } = require('../Models/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('../Service/token-service');

class UserService {
  
  async registration(firstName, lastName, email, password) {
    try {
      const candidate = await UserBase.findOne({ where: { email } });

      if (candidate) {
        throw new Error('Email уже занят или неправильно введён');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const token = await tokenService.generateTokens({ firstName, lastName, email });

      await UserBase.create({ email, password: hashedPassword, firstName, lastName, refreshToken: token.refreshToken });

      return { token };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const candidate = await UserBase.findOne({ where: { email } });

      if (!candidate) {
        throw new Error('Пользователь не найден');
      }

      const match = await bcrypt.compare(password, candidate.password);

      if (!match) {
        throw new Error('Неверный пароль');
      }

      const token = await tokenService.generateTokens({ email, firstName: candidate.firstName, lastName: candidate.lastName });
      await tokenService.saveToken(email, token.refreshToken);

      return { token };
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  }

  async logout(refreshToken) {
    try {
      console.log(refreshToken);
      const token = await tokenService.removeToken(refreshToken);
      return token;
    } catch (error) {
      console.error('Ошибка выхода:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('Токен не передан');
      }

      const userData = await UserBase.findOne({ where: { refreshToken } });
      const userToken = tokenService.validateToken(refreshToken, process.env.JWT_REFRASH_KEY);
      const tokenFromDb = await tokenService.findToken(refreshToken);

      if (!userToken || tokenFromDb.expirationDate < new Date()) {
        throw new Error('Токен недействителен или устарел');
      }

      const user = await UserBase.findByPk(userToken.email);

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      const tokens = tokenService.generateTokens({ email: user.email, firstName: user.firstName, lastName: user.lastName });

      return { tokens };
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await UserBase.findAll();
      return users;
    } catch (error) {
      console.error('Ошибка получения пользователей:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
