const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { forwardAuthenticated, requireAuth } = require('../middlewares/authMiddleware');

router.get('/login', forwardAuthenticated, authController.loginPage);
router.post('/login', forwardAuthenticated, authController.login);

router.get('/register', forwardAuthenticated, authController.registerPage);
router.post('/register', forwardAuthenticated, authController.register);

router.get('/logout', requireAuth, authController.logout);

module.exports = router;
