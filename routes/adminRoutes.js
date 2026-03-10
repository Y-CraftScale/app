const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middlewares/authMiddleware');

router.use(requireAdmin); // Protect all routes below

router.get('/', adminController.getAdminDashboard);
router.post('/ban/:id', adminController.toggleBan);
router.post('/comment/approve/:id', adminController.approveComment);
router.post('/comment/delete/:id', adminController.deleteComment);

module.exports = router;
