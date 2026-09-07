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
// Adjust these paths to match your actual route files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/modules', require('./routes/modules'));
app.use('/api/attempts', require('./routes/attempts'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/sync', require('./routes/sync'));

// ---------- MongoDB Connection ----------
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

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