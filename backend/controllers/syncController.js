const Attempt = require('../models/Attempt');

exports.syncAttempts = async (req, res) => {
  try {
    const { attempts } = req.body;
    const savedAttempts = [];

    for (const att of attempts) {
      const exists = await Attempt.findOne({
        user: req.userId,
        module: att.module,
        createdAt: att.createdAt,
      });
      if (!exists) {
        const saved = await Attempt.create({ ...att, user: req.userId });
        savedAttempts.push(saved);
      }
    }

    res.status(200).json({ message: 'Sync complete', synced: savedAttempts.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};