// Controllers/user-controller.js
const UserService = require('../Service/user-service');

class UserController {
  async registration(req, res, next) {
    try {

      const { firstname, lastname, email, password } = req.body;
      

      if (!firstname ||!lastname ||!email ||!password) {
        return res.status(400).json({ message: 'Необходимо заполнить все поля.' });
      }

      const userData = await UserService.registration(firstname, lastname, email, password);
      res.cookie('refreshToken', userData.token.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie('refreshToken', userData.token.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(`Был удален токен: ` + token);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      console.log(refreshToken)
      const userData = await UserService.refreshToken(refreshToken);
      res.cookie('refreshToken', userData.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      return res.json(users);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
