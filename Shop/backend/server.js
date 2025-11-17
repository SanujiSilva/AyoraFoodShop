import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import DailyFood from './models/DailyFood.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/notices', noticeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ayora Foods API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Scheduled task to clean up old daily food items
// Runs every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Delete all food items from previous days
    const result = await DailyFood.deleteMany({
      date: { $lt: today }
    });

    console.log(`🧹 Daily cleanup: Removed ${result.deletedCount} old food items`);
  } catch (error) {
    console.error('Error during daily food cleanup:', error);
  }
});

// Initial cleanup on server start
(async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await DailyFood.deleteMany({
      date: { $lt: today }
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Startup cleanup: Removed ${result.deletedCount} old food items`);
    }
  } catch (error) {
    console.error('Error during startup cleanup:', error);
  }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
