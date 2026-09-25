const User = require('../models/User');
const Module = require('../models/Module');
const Attempt = require('../models/Attempt');

// ---------------------------------------------------------
// 1. Dashboard Overview Stats
// ---------------------------------------------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalModules = await Module.countDocuments();
    const totalAttempts = await Attempt.countDocuments();
    const passedAttempts = await Attempt.countDocuments({ passed: true });

    const passRate = totalAttempts > 0
      ? ((passedAttempts / totalAttempts) * 100).toFixed(1)
      : 0;

    const avgScoreResult = await Attempt.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } }
    ]);
    const avgScore = avgScoreResult[0]?.avgScore?.toFixed(1) || 0;

    const avgResponseResult = await Attempt.aggregate([
      { $group: { _id: null, avgResponse: { $avg: "$timeTakenSeconds" } } }
    ]);
    const avgResponseTime = avgResponseResult[0]?.avgResponse?.toFixed(1) || 0;

    res.status(200).json({
      totalWorkers,
      totalModules,
      totalAttempts,
      passRate: `${passRate}%`,
      avgScore,
      avgResponseTime: `${avgResponseTime}s`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------------
// 2. Recent Activity (Training Records table)
// ---------------------------------------------------------
exports.getRecentActivity = async (req, res) => {
  try {
    const recent = await Attempt.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('module', 'title');

    const formatted = recent.map(attempt => ({
      sessionId: attempt._id,
      trainee: attempt.user?.name || 'Unknown',
      scenario: attempt.module?.title || 'Unknown',
      score: attempt.score,
      responseTime: `${attempt.timeTakenSeconds}s`,
      result: attempt.passed ? 'PASSED' : 'FAILED',
      date: attempt.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------------
// 3. Per-Trainee Stats (Trainees page table)
// ---------------------------------------------------------
exports.getTraineeList = async (req, res) => {
  try {
    const trainees = await Attempt.aggregate([
      {
        $group: {
          _id: "$user",
          sessions: { $sum: 1 },
          avgScore: { $avg: "$score" },
          lastTraining: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userInfo.name",
          email: "$userInfo.email",
          sessions: 1,
          avgScore: { $round: ["$avgScore", 1] },
          lastTraining: 1,
          status: {
            $cond: {
              if: { $lt: ["$avgScore", 60] },
              then: "NEEDS TRAINING",
              else: "ACTIVE"
            }
          }
        }
      },
      { $sort: { lastTraining: -1 } }
    ]);

    res.status(200).json(trainees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------------
// 4. Weekly Trends (Training Progress charts)
// ---------------------------------------------------------
exports.getWeeklyTrends = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trends = await Attempt.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgScore: { $avg: "$score" },
          avgResponseTime: { $avg: "$timeTakenSeconds" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          avgScore: { $round: ["$avgScore", 1] },
          avgResponseTime: { $round: ["$avgResponseTime", 1] }
        }
      }
    ]);

    res.status(200).json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};