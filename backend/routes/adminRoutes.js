const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getDashboardStats, getRecentActivity } = require('../controllers/adminController');

router.get('/stats', protect, getDashboardStats);
router.get('/activity', protect, getRecentActivity);

module.exports = router;