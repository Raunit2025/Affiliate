require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const linksRoutes = require('./src/routes/linksRoutes');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_ENDPOINT,
    credentials: true,
  })
);

app.use('/auth', authRoutes);
app.use('/links', linksRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
