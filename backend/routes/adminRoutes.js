const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentActivity,
  getTraineeList,
  getWeeklyTrends
} = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.get('/recent-activity', getRecentActivity);
router.get('/trainees', getTraineeList);
router.get('/trends', getWeeklyTrends);

module.exports = router;