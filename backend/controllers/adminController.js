const User = require('../models/User');
const Module = require('../models/Module');
const Attempt = require('../models/Attempt');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalModules = await Module.countDocuments();
    const totalAttempts = await Attempt.countDocuments();
    const passedAttempts = await Attempt.countDocuments({ passed: true });

    const passRate = totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(1) : 0;

    res.status(200).json({
      totalWorkers,
      totalModules,
      totalAttempts,
      passRate: `${passRate}%`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const recent = await Attempt.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('module', 'title');
    res.status(200).json(recent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
