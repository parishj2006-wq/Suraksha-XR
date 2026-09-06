const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/test', (req, res) => {
  res.json({ message: 'test route works' });
});

app.get('/', (req, res) => {
  res.send('Suraksha-XR backend is running');
});

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});