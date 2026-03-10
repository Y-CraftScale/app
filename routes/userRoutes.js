const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, checkUser } = require('../middlewares/authMiddleware');

// Dashboard & Settings (Protected)
router.get('/dashboard', requireAuth, userController.dashboard);
router.get('/profile/edit', requireAuth, userController.getProfileEdit);
router.post('/profile/edit', requireAuth, userController.updateProfile);

// Social Features (Protected for actions, public for viewing)
router.get('/users/search', userController.searchUsers);
router.get('/user/:id', checkUser, userController.getPublicProfile);
router.post('/friends/request', requireAuth, userController.sendFriendRequest);
router.post('/friends/accept', requireAuth, userController.acceptFriendRequest);

module.exports = router;
