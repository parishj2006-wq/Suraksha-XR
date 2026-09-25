const Attempt = require('../models/Attempt');

exports.createAttempt = async (req, res) => {
  try {
    const attempt = await Attempt.create({ ...req.body, user: req.userId });
    res.status(201).json(attempt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.userId }).populate('module');
    res.status(200).json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttemptsByModule = async (req, res) => {
  try {
    const attempts = await Attempt.find({ module: req.params.moduleId });
    res.status(200).json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};