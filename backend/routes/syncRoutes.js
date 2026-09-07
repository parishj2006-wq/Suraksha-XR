const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { syncAttempts } = require('../controllers/syncController');

router.post('/', protect, syncAttempts);

module.exports = router;