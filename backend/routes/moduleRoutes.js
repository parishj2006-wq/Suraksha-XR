const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createModule, getModules, getModuleById, updateModule, deleteModule,
} = require('../controllers/moduleController');

router.get('/', getModules);
router.get('/:id', getModuleById);
router.post('/', protect, createModule);
router.put('/:id', protect, updateModule);
router.delete('/:id', protect, deleteModule);

module.exports = router;