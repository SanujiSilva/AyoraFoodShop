# 🚀 Vercel Deployment Guide - Ayora Food Shop (Web Dashboard)

## Overview
This guide will help you deploy your full-stack MERN app to Vercel using the web dashboard - no CLI needed!

---

## 📋 Prerequisites

- GitHub account with your code pushed
- MongoDB Atlas account (free tier)
- Vercel account (sign up at https://vercel.com)

---

## Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a FREE account
3. Create a new cluster (M0 Free tier)
4. **Database Access**: 
   - Click "Database Access" → "Add New Database User"
   - Username: `ayorafood`
   - Password: Create a secure password (save it!)
   - Database User Privileges: Read and write to any database
   - Click "Add User"
   
5. **Network Access**: 
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Add `0.0.0.0/0`
   - Click "Confirm"
   
6. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://ayorafood:<password>@cluster0.xxxxx.mongodb.net/ayora-foods`
   - Replace `<password>` with your actual password

**Save this connection string - you'll need it!**

---

## Step 2: Push Your Code to GitHub

If you haven't already:

```bash
cd d:\OutSideProjects\AyoraFoodShop
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 3: Deploy Backend to Vercel

### A. Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" (or "Login" if you have an account)
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### B. Import Backend Project

1. Click "Add New..." → "Project"
2. Find your **AyoraFoodShop** repository
3. Click "Import"

### C. Configure Backend Deployment

1. **Framework Preset**: Select "Other"
2. **Root Directory**: Click "Edit" → Enter `Shop/backend` → Click "Continue"
3. **Build Settings**:
   - Build Command: Leave empty
   - Output Directory: Leave empty
   - Install Command: `npm install`

4. **Environment Variables** - Click "Add" for each:
   
   | Name | Value |
   |------|-------|
   | `MONGO_URI` | Your MongoDB connection string |
   | `JWT_SECRET` | `ayora_food_jwt_secret_2024_super_secure_random_key` |
   | `NODE_ENV` | `production` |

5. Click "Deploy"

6. Wait 2-3 minutes for deployment to complete

7. **Copy your backend URL** (e.g., `https://ayora-food-shop.vercel.app`)
   - You'll see it at the top after deployment

---

## Step 4: Deploy Frontend to Vercel

### A. Import Frontend Project

1. From Vercel dashboard, click "Add New..." → "Project"
2. Find your **AyoraFoodShop** repository again
3. Click "Import"

### B. Configure Frontend Deployment

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Click "Edit" → Enter `Shop/frontend` → Click "Continue"
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables** - Click "Add":
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://your-backend-url.vercel.app/api` |
   
   **Important**: Replace with YOUR actual backend URL from Step 3, add `/api` at the end
   
   Example: `https://ayora-food-shop-backend.vercel.app/api`

5. **Project Name**: Change to `ayora-food-shop-frontend` (to differentiate from backend)

6. Click "Deploy"

7. Wait 2-3 minutes for deployment

8. **Copy your frontend URL** (e.g., `https://ayora-food-shop-frontend.vercel.app`)

---

## Step 5: Update Backend CORS

### A. Add Frontend URL to Backend

1. Go to Vercel dashboard
2. Click on your **backend** project
3. Go to "Settings" → "Environment Variables"
4. Click "Add New"
   - Name: `FRONTEND_URL`
   - Value: Your frontend URL (e.g., `https://ayora-food-shop-frontend.vercel.app`)
5. Click "Save"

### B. Redeploy Backend

1. Go to "Deployments" tab
2. Click the three dots (•••) on the latest deployment
3. Click "Redeploy"
4. Click "Redeploy" again to confirm

---

## ✅ Test Your Deployment

1. Visit your **frontend URL**
2. **Register** a new customer account
3. **Browse** daily foods menu
4. **Place** an order
5. **Login as admin** at `/login`:
   - Email: `admin@ayora.com`
   - Password: `admin123`
6. Test admin dashboard features

---

## 🔄 Deploy Updates (After Code Changes)

### Method 1: Automatic (Recommended)

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Vercel automatically detects and deploys changes!
4. Check "Deployments" tab to see progress

### Method 2: Manual Redeploy

1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments"
4. Click three dots (•••) on any deployment
5. Click "Redeploy"

---

## 🎯 Managing Environment Variables

### To Update/Add Variables:

1. Go to Vercel dashboard → Your project
2. Click "Settings" → "Environment Variables"
3. Edit existing or add new variables
4. Click "Save"
5. **Important**: Redeploy for changes to take effect

### To Remove Variables:

1. Same path as above
2. Click "Remove" next to the variable
3. Redeploy the project

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain:

1. Go to project → "Settings" → "Domains"
2. Click "Add"
3. Enter your domain name (e.g., `ayorafood.com`)
4. Follow DNS configuration instructions
5. Vercel provides SSL certificate automatically
6. Update backend `FRONTEND_URL` to your custom domain

---

## 🔒 Security Checklist

- [ ] Use strong `JWT_SECRET` (min 32 random characters)
- [ ] MongoDB password is secure
- [ ] Change default admin password after first login
- [ ] Never commit `.env` files to GitHub
- [ ] Review CORS settings in production
- [ ] MongoDB IP whitelist set to `0.0.0.0/0`

---

## 💡 Vercel Free Tier Benefits

- ✅ **100GB bandwidth** per month
- ✅ **Unlimited** deployments
- ✅ **No cold starts** - instant response
- ✅ **Automatic HTTPS** and CDN
- ✅ **Free SSL certificates**
- ✅ **Git integration** - auto-deploy on push
- ✅ **Serverless functions** - 100GB-Hrs

Perfect for production apps!

---

## 🐛 Troubleshooting

### CORS Error in Browser Console

**Problem**: `Access to fetch blocked by CORS policy`

**Solution**: 
1. Check backend environment variables
2. Verify `FRONTEND_URL` matches your frontend URL exactly
3. No trailing slash in URL
4. Redeploy backend after adding variable

### API 404 Error

**Problem**: `GET https://...vercel.app/api/... 404 Not Found`

**Solution**: 
1. Ensure backend `vercel.json` exists in `Shop/backend`
2. Check `VITE_API_URL` ends with `/api`
3. Verify routes are correct in `server.js`

### Database Connection Error

**Problem**: `MongoServerError: Authentication failed`

**Solution**:
1. Verify `MONGO_URI` is correct
2. Check password doesn't contain special characters (or URL encode them)
3. Confirm MongoDB Atlas allows IP `0.0.0.0/0`
4. Test connection string with MongoDB Compass first

### Build Failed

**Problem**: Vercel deployment fails during build

**Solution**:
1. Check "Deployments" tab → Click failed deployment → View logs
2. Look for error messages
3. Common issues:
   - Missing dependencies in `package.json`
   - Incorrect build commands
   - Wrong root directory
4. Fix locally, then push again

### Environment Variables Not Working

**Problem**: App can't read environment variables

**Solution**:
1. Verify variable names match exactly (case-sensitive)
2. Frontend variables must start with `VITE_`
3. Redeploy after adding/changing variables
4. Check "Deployments" logs for variable values

---

## 📱 Your Live URLs

After successful deployment:

- **Customer App**: `https://ayora-food-shop-frontend.vercel.app`
- **Admin Panel**: `https://ayora-food-shop-frontend.vercel.app/login`
- **Backend API**: `https://ayora-food-shop-backend.vercel.app`
- **API Test**: `https://ayora-food-shop-backend.vercel.app/` (should show welcome message)

---

## 📊 Monitoring Your App

### View Logs:

1. Go to project dashboard
2. Click "Deployments"
3. Click on any deployment
4. View "Building", "Function Logs", etc.

### Analytics:

1. Go to project → "Analytics"
2. View page views, visitors, and performance
3. Free tier includes basic analytics

---

## 🎉 Congratulations!

Your Ayora Food Shop is now live on Vercel with:
- ✅ Global CDN distribution
- ✅ Automatic HTTPS encryption
- ✅ Instant deployments
- ✅ Professional hosting
- ✅ Zero server management

**Share your app with the world!** 🌍

---

## 🆘 Need More Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Community: https://github.com/vercel/vercel/discussions
