const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/dashboard', userController.dashboard);
router.get('/profile', userController.profile);
router.post('/favorites/add', userController.addFavorite);
router.post('/favorites/remove', userController.removeFavorite);

module.exports = router;
