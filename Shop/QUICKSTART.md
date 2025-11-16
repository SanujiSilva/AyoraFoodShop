# 🚀 Quick Start Guide - Ayora Foods

## ⏱️ 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure MongoDB (1 minute)

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=ayora-foods-secret-key-change-in-production-12345
NODE_ENV=development
```

### Step 3: Run the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Access the Application (30 seconds)

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Step 5: Create Admin Account (30 seconds)

**Option A: Using Postman/Thunder Client**

POST to `http://localhost:5000/api/auth/admin-register`

Body:
```json
{
  "name": "Admin User",
  "email": "admin@ayorafoods.com",
  "password": "admin123"
}
```

**Option B: Using PowerShell**

```powershell
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    name = "Admin User"
    email = "admin@ayorafoods.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/admin-register" -Method Post -Headers $headers -Body $body
```

### Step 6: Login and Test (1 minute)

#### Admin Login
- Go to: http://localhost:3000/admin/login
- Email: `admin@ayorafoods.com`
- Password: `admin123`

#### Customer Registration
- Go to: http://localhost:3000/register
- Fill in the form to create a customer account

## 📋 What You Get

### ✅ Backend Features
- JWT Authentication
- User & Admin Management
- Food CRUD Operations
- Order Management
- Auto-incrementing Order Numbers
- Daily Income Analytics
- Location-based Analytics

### ✅ Frontend Features
- Beautiful Responsive UI
- Customer Dashboard
- Admin Dashboard
- Shopping Cart
- Order Tracking
- Profile Management
- Toast Notifications

## 🎯 Next Steps

1. **Add Food Items:**
   - Login as admin
   - Go to "Manage Foods"
   - Click "Add New Food"
   - Fill in details and save

2. **Test Customer Flow:**
   - Register as a customer
   - Browse daily menu
   - Add items to cart
   - Place an order
   - Check order history

3. **Explore Admin Features:**
   - View dashboard analytics
   - Manage orders
   - View customers
   - Update order status

## ⚡ Common Commands

### Backend
```bash
# Start server
npm start

# Development mode (auto-restart)
npm run dev
```

### Frontend
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🐛 Quick Troubleshooting

**MongoDB Connection Failed?**
- Check if your IP is whitelisted in MongoDB Atlas
- Verify the connection string in `.env`

**Port Already in Use?**
- Change the PORT in `backend/.env`
- Or kill the process: `taskkill /F /IM node.exe` (Windows)

**Frontend Not Loading?**
- Ensure backend is running first
- Clear browser cache
- Check console for errors

## 📞 Need Help?

Check the full README.md for detailed documentation and troubleshooting.

---

**You're all set! Happy coding! 🎉**
