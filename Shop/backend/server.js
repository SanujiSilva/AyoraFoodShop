// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';

// ❌ node-cron & DailyFood removed for Vercel version
// import cron from 'node-cron';
// import DailyFood from './models/DailyFood.js';

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

// Root route (for testing)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ayora Foods API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: 'Something went wrong!', error: err.message });
});

// ❌ REMOVE this for Vercel:
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// ✅ EXPORT app instead of listening
export default app;
