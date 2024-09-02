const tokenService = require('../Service/token-service');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(authorizationHeader);
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(accessToken);
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(userData);
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(e);
    }
};