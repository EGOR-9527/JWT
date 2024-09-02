require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserBase } = require('../Models/user-model');

class TokenService {
  generateTokens(payload) {
    try {
      if (!process.env.JWT_ACCESS_KEY || !process.env.JWT_REFRASH_KEY) {
        throw new Error('Секретные ключи JWT не определены');
      }

      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRASH_KEY, { expiresIn: '30d' });

      console.log(payload);
      return { accessToken, refreshToken };
    } catch (err) {
      console.error('Ошибка генерации токенов:', err);
      return null;
    }
  }

  validateToken(token, secretKey) {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      console.error('Ошибка валидации токена:', error);
      return null;
    }
  }

  async saveToken(email, refreshToken) {
    try {
      const tokenData = await UserBase.findOne({ where: { email } });
      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return await tokenData.save();
      }
      return await UserBase.create({ email, refreshToken });
    } catch (error) {
      console.error('Ошибка сохранения токена:', error);
      return null;
    }
  }

  async removeToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token не определен');
      }
  
      const user = await UserBase.findOne({ where: { refreshToken } });
      if (user) {
        user.refreshToken = null;
        await user.save();
        return 'Токен пользователя успешно удален';
      } else {
        return 'Пользователь с таким токеном не найден';
      }
    } catch (error) {
      console.error('Ошибка удаления токена пользователя:', error);
      throw error;
    }
  }

  async findToken(refreshToken) {
    try {
      return await UserBase.findOne({ where: { refreshToken } });
    } catch (error) {
      console.error('Ошибка поиска токена:', error);
      return null;
    }
  }
}

module.exports = new TokenService();
