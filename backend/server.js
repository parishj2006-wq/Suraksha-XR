// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- Root / Health Check ----------
app.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? 'connected' :
    dbState === 2 ? 'connecting' :
    dbState === 3 ? 'disconnecting' :
    'disconnected';

  res.send(`Suraksha-XR backend is running — DB: ${dbStatus}`);
});

// Optional: JSON version for programmatic pings (frontend/deploy checks)
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? 'connected' :
    dbState === 2 ? 'connecting' :
    dbState === 3 ? 'disconnecting' :
    'disconnected';

  res.json({
    status: 'ok',
    server: 'running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// ---------- Routes ----------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/modules', require('./routes/moduleRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/sync', require('./routes/syncRoutes'));

// ---------- MongoDB Connection ----------
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('ERROR: No MongoDB URI found in .env (expected MONGO_URI or MONGODB_URI)');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected to Atlas (suraksha-xr)');
    app.listen(PORT, () => {
      console.log(`Suraksha-XR backend is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });