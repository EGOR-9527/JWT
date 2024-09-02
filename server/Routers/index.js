const express = require('express');
const { Router } = require('express');
const UserController = require('../Controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware')
const router = new Router();

router.get('/users', UserController.getUser);
router.get('/token',authMiddleware, UserController.refresh);

router.post('/registr', UserController.registration);
router.post('/login', UserController.login);

router.delete('/logout', UserController.logout);

module.exports = router;
