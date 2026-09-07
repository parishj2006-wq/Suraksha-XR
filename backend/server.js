const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Suraksha-XR backend is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/modules', require('./routes/moduleRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/sync', require('./routes/syncRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});