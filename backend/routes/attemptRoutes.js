const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createAttempt, getMyAttempts, getAttemptsByModule,
} = require('../controllers/attemptController');

router.post('/', protect, createAttempt);
router.get('/mine', protect, getMyAttempts);
router.get('/module/:moduleId', protect, getAttemptsByModule);

module.exports = router;