const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getRecentActivity,
  getTraineeList,
  getWeeklyTrends
} = require('../controllers/adminController');

router.get('/stats', authMiddleware, getDashboardStats);
router.get('/recent-activity', authMiddleware, getRecentActivity);
router.get('/trainees', authMiddleware, getTraineeList);
router.get('/trends', authMiddleware, getWeeklyTrends);

module.exports = router;