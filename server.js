const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

//Initialize express
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());

// Serve static files (for uploaded documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use('/auth', authRoutes);
app.use('/business', businessRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Business Management System API');
});

// Import the scheduler
require('./scheduler/notifications');

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
