const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', adminController.usersList);
router.post('/ban/:id', adminController.banUser);

module.exports = router;
