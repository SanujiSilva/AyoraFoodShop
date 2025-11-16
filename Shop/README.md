# 🍽️ Ayora Foods - MERN Stack Food Ordering Application

A complete, mobile-responsive food ordering system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, admin panel, and customer interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Sample Test Users](#sample-test-users)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Customer Features
- ✅ User registration and authentication
- ✅ Browse daily food menu
- ✅ Add items to cart with quantity management
- ✅ Real-time cart total calculation
- ✅ Place orders with delivery details
- ✅ View order history with status tracking
- ✅ Update profile information
- ✅ Order number tracking system

### Admin Features
- ✅ Admin authentication and dashboard
- ✅ Add, edit, and delete daily food items
- ✅ View all orders with status management
- ✅ Add orders manually
- ✅ Daily income analytics
- ✅ Orders by location statistics
- ✅ View all registered customers
- ✅ Manage food inventory

### Technical Features
- ✅ JWT-based authentication
- ✅ Protected routes for admin and customers
- ✅ Context API for state management
- ✅ Auto-incrementing order numbers
- ✅ Mobile-responsive design
- ✅ Toast notifications
- ✅ Bootstrap UI components
- ✅ RESTful API architecture

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas online)
- **Mongoose** - ODM library
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Bootstrap** - UI components
- **Context API** - State management
- **React Toastify** - Notifications

## 📁 Project Structure

```
Ayora-Foods/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin business logic
│   │   ├── authController.js     # Authentication logic
│   │   └── customerController.js # Customer business logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── Counter.js            # Auto-increment counter
│   │   ├── DailyFood.js          # Food item model
│   │   ├── Order.js              # Order model
│   │   └── User.js               # User model
│   ├── routes/
│   │   ├── adminRoutes.js        # Admin routes
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── foodRoutes.js         # Food routes
│   │   └── orderRoutes.js        # Order routes
│   ├── .env.example              # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx    # Admin route protection
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── FoodCard.jsx      # Food item card
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── PrivateRoute.jsx  # Customer route protection
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication context
│   │   │   └── CartContext.jsx   # Shopping cart context
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AddDailyFood.jsx
│   │   │   │   ├── AddOrderManual.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── Customers.jsx
│   │   │   │   ├── ManageFoods.jsx
│   │   │   │   └── OrdersList.jsx
│   │   │   └── customer/
│   │   │       ├── Cart.jsx
│   │   │       ├── DailyFoods.jsx
│   │   │       ├── Home.jsx
│   │   │       ├── Login.jsx
│   │   │       ├── OrderHistory.jsx
│   │   │       ├── PlaceOrder.jsx
│   │   │       ├── Profile.jsx
│   │   │       └── Register.jsx
│   │   ├── utils/
│   │   │   └── axios.js          # Axios configuration
│   │   ├── App.css               # Custom styles
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone or Download the Repository

```bash
# If using Git
git clone <repository-url>
cd Ayora-Foods

# Or download and extract the ZIP file
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in

2. **Create a New Cluster**
   - Click "Build a Cluster"
   - Choose the FREE tier
   - Select your preferred region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Grant "Read and Write to any database" privileges

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

### Backend Environment Variables

1. Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

2. Edit `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/ayorafoods?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
NODE_ENV=development
```

**Important Notes:**
- Replace `your-username` and `your-password` with your MongoDB Atlas credentials
- Replace `your-super-secret-jwt-key` with a strong random string (at least 32 characters)
- The database name is `ayorafoods` (you can change this)

## 🎯 Running the Application

### Option 1: Run Separately (Recommended for Development)

#### Terminal 1 - Backend Server

```bash
cd backend
npm start
# Or for development with auto-restart:
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Option 2: Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/dist` directory.

## 👥 Sample Test Users

### Admin Account

```
Email: admin@ayorafoods.com
Password: admin123
```

**To create this admin account:**

1. Start the backend server
2. Use a tool like Postman or curl:

```bash
curl -X POST http://localhost:5000/api/auth/admin-register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@ayorafoods.com",
    "password": "admin123"
  }'
```

### Customer Account

```
Email: customer@test.com
Password: customer123
```

**To create this customer account:**

Use the registration page in the frontend or:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "customer@test.com",
    "password": "customer123",
    "phone": "0771234567",
    "location": "Colombo"
  }'
```

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new customer | Public |
| POST | `/api/auth/admin-register` | Register new admin | Public |
| POST | `/api/auth/login` | Login user/admin | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update profile | Private |

### Food Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/foods/daily` | Get daily foods | Public |

### Order Routes (Customer)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders/place` | Place new order | Private |
| GET | `/api/orders/history` | Get order history | Private |
| GET | `/api/orders/:orderNumber` | Get order by number | Private |

### Admin Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/admin/foods` | Add food item | Admin |
| GET | `/api/admin/foods` | Get all foods | Admin |
| PUT | `/api/admin/foods/:id` | Update food | Admin |
| DELETE | `/api/admin/foods/:id` | Delete food | Admin |
| GET | `/api/admin/orders` | Get all orders | Admin |
| POST | `/api/admin/orders` | Add order manually | Admin |
| PUT | `/api/admin/orders/:id/status` | Update order status | Admin |
| GET | `/api/admin/daily-income` | Get daily income | Admin |
| GET | `/api/admin/orders-by-location` | Get orders by location | Admin |
| GET | `/api/admin/customers` | Get all customers | Admin |

## 📸 Usage Guide

### For Customers

1. **Register/Login**
   - Go to the homepage
   - Click "Sign Up" to create an account
   - Or click "Login" if you already have an account

2. **Browse Foods**
   - Click "Daily Menu" in the navigation
   - View available food items for the day

3. **Add to Cart**
   - Click "Add to Cart" on any food item
   - Adjust quantities in the cart

4. **Place Order**
   - Go to Cart
   - Click "Proceed to Checkout"
   - Fill in delivery details
   - Click "Place Order"
   - Save your order number!

5. **Track Orders**
   - Go to "Order History" from your profile dropdown
   - View all your past orders and their status

### For Admins

1. **Login**
   - Go to `/admin/login`
   - Enter admin credentials

2. **Dashboard**
   - View daily income statistics
   - See total orders
   - Check orders by location

3. **Manage Foods**
   - Click "Manage Foods"
   - Add new food items
   - Edit or delete existing items

4. **Manage Orders**
   - View all customer orders
   - Update order status (Pending/Confirm/Cancelled)
   - Add manual orders

5. **View Customers**
   - See all registered customers
   - View their contact information

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Error: MongooseServerSelectionError
```
**Solution:**
- Check if MongoDB Atlas IP whitelist includes your IP
- Verify MONGODB_URI in `.env` file
- Ensure username and password are correct
- Check if cluster is running

**Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000

### Frontend Issues

**Cannot Connect to Backend**
```
Network Error / CORS Error
```
**Solution:**
- Ensure backend server is running
- Check `vite.config.js` proxy settings
- Verify axios baseURL in `src/utils/axios.js`

**Module Not Found**
```
Error: Cannot find module 'react'
```
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Common Issues

**JWT Token Expired**
- Log out and log in again
- Clear browser localStorage

**Food Items Not Showing**
- Ensure you've added food items via admin panel
- Check if food quantity is greater than 0

## 🔒 Security Notes

For production deployment:

1. Change JWT_SECRET to a strong random string
2. Enable MongoDB IP whitelist for specific IPs only
3. Use environment-specific `.env` files
4. Enable HTTPS
5. Add rate limiting
6. Implement input validation and sanitization
7. Add CORS whitelist for specific domains
8. Use secure HTTP headers (helmet.js)

## 📝 Development Tips

### Add Sample Food Items

Use Postman or curl to add food items:

```bash
curl -X POST http://localhost:5000/api/admin/foods \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "foodName": "Chicken Rice",
    "price": 350,
    "quantity": 50,
    "description": "Delicious chicken rice with vegetables",
    "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19"
  }'
```

### Database Seeding Script

You can create a seed script in `backend/seed.js`:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import DailyFood from './models/DailyFood.js';

dotenv.config();
connectDB();

const foods = [
  { foodName: 'Rice & Curry', price: 250, quantity: 100, description: 'Traditional Sri Lankan rice and curry' },
  { foodName: 'Fried Rice', price: 300, quantity: 80, description: 'Special fried rice with chicken' },
  { foodName: 'Kottu Roti', price: 350, quantity: 60, description: 'Chopped roti with vegetables and egg' },
];

const seedData = async () => {
  try {
    await DailyFood.deleteMany();
    await DailyFood.insertMany(foods);
    console.log('✅ Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
```

Run with: `node seed.js`

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables if needed
4. Configure redirects for React Router

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

**Ayora Foods Team**

---

**Happy Coding! 🚀**

For any questions or issues, please create an issue in the repository.
