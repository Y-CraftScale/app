const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.use(requireAuth);

router.get('/dashboard', userController.dashboard);
router.get('/profile/edit', userController.getProfileEdit);
router.post('/profile/edit', userController.updateProfile);

module.exports = router;
