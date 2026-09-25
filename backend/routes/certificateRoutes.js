const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { generateCertificate, verifyCertificate } = require('../controllers/certificateController');

router.post('/generate', protect, generateCertificate);
router.get('/verify/:id', verifyCertificate);

module.exports = router;