require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./src/routes/authRoutes');
const linksRoutes = require('./src/routes/linksRoutes');
const userRoutes = require('./src/routes/userRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

const app = express();

// ✅ CORRECT CORS SETUP
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ JSON Body Parsing
app.use((req, res, next) => {
  if (req.originalUrl === '/payments/webhook') {
    next(); // skip json parsing
  } else {
    express.json()(req, res, next);
  }
});

app.use(cookieParser());

// ✅ Register routes
app.use('/auth', authRoutes);
app.use('/links', linksRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);

// ✅ Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(error));

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
