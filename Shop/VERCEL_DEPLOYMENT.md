# 🚀 Render (Backend) + Vercel (Frontend) Deployment Guide

## Overview
Deploy your backend to Render and frontend to Vercel for a powerful, free hosting solution.

---

## 📋 Prerequisites

- GitHub account with your code pushed
- MongoDB Atlas account (free tier)
- Render account (https://render.com)
- Vercel account (https://vercel.com)

---

## Part 1: Setup MongoDB Atlas (5 minutes)

### Step 1: Create MongoDB Database

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a FREE account
3. Create a new cluster (M0 Free tier)

### Step 2: Configure Database Access

1. Click **"Database Access"** → **"Add New Database User"**
   - Username: `ayorafood`
   - Password: Create a secure password (save it!)
   - Database User Privileges: **Read and write to any database**
   - Click **"Add User"**

### Step 3: Configure Network Access
   
1. Click **"Network Access"** → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"**
3. Add IP: `0.0.0.0/0`
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string
4. Example: `mongodb+srv://ayorafood:<password>@cluster0.xxxxx.mongodb.net/ayora-foods`
5. **Replace `<password>`** with your actual password

**Save this connection string - you'll need it!**

---

## Part 2: Deploy Backend to Render (10 minutes)

### Step 1: Sign Up to Render

1. Go to https://render.com
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"GitHub"** to sign up
4. Authorize Render to access your GitHub repositories

### Step 2: Create Web Service

1. From Render dashboard, click **"New +"** → **"Web Service"**
2. Click **"Configure account"** if needed to connect GitHub
3. Find and select your **AyoraFoodShop** repository
4. Click **"Connect"**

### Step 3: Configure Backend Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `ayora-food-backend` (or your preferred name) |
| **Root Directory** | `Shop/backend` |
| **Environment** | `Node` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section and add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB connection string from Part 1 |
| `JWT_SECRET` | `ayora_food_jwt_secret_2024_super_secure_random_key` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

Click **"Add Environment Variable"** for each one.

### Step 5: Deploy Backend

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying (takes 5-10 minutes)
3. Wait for status to show **"Live"** (green dot)
4. **Copy your backend URL** from the top (e.g., `https://ayora-food-backend.onrender.com`)

### Step 6: Test Backend

Visit your backend URL in browser - you should see:
```json
{"message": "Welcome to Ayora Foods API"}
```

✅ **Backend is live!**

---

## Part 3: Deploy Frontend to Vercel (10 minutes)

### Step 1: Sign Up to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

### Step 2: Import Frontend Project

1. From Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your **AyoraFoodShop** repository
3. Click **"Import"**

### Step 3: Configure Frontend Deployment

1. **Framework Preset**: Vercel should auto-detect **"Vite"**
2. **Root Directory**: Click **"Edit"** → Enter `Shop/frontend` → Click **"Continue"**
3. **Build Settings**:
   - Build Command: `npm run build` (should be auto-filled)
   - Output Directory: `dist` (should be auto-filled)
   - Install Command: `npm install` (should be auto-filled)

### Step 4: Add Environment Variable

Under **"Environment Variables"** section:

1. Click **"Add"** or enter the variable:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://ayora-food-backend.onrender.com/api` |

**⚠️ Important**: 
- Use YOUR actual Render backend URL from Part 2
- Must end with `/api`
- Example: `https://ayora-food-backend.onrender.com/api`

2. Leave **"Production"** selected

### Step 5: Deploy Frontend

1. Optionally change **Project Name** to `ayora-food-shop` or your preference
2. Click **"Deploy"**
3. Wait 2-3 minutes for deployment
4. You'll see a success screen with confetti! 🎉
5. **Copy your frontend URL** (e.g., `https://ayora-food-shop.vercel.app`)

---

## Part 4: Connect Frontend & Backend (5 minutes)

### Update Backend CORS

1. Go back to **Render dashboard**
2. Click on your **backend service**
3. Go to **"Environment"** tab on the left
4. Click **"Add Environment Variable"**

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://ayora-food-shop.vercel.app` |

**⚠️ Important**: 
- Use YOUR actual Vercel frontend URL from Part 3
- **NO trailing slash** at the end

5. Click **"Save Changes"**
6. Your backend will automatically **redeploy** (takes 2-3 minutes)

---

## ✅ Test Your Deployment

1. Visit your **frontend URL** (Vercel)
2. **Register** a new customer account
3. **Browse** the daily foods menu
4. **Place** an order
5. **Login as admin** at `/login`:
   - Email: `admin@ayora.com`
   - Password: `admin123`
6. Test admin dashboard features

**Everything should work perfectly!** 🎉

---

## 🔄 Deploy Updates (After Code Changes)

### Backend (Render):

**Automatic (Recommended)**:
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render automatically detects and deploys changes!

**Manual**:
1. Go to Render dashboard → Your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Frontend (Vercel):

**Automatic (Recommended)**:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel automatically detects and deploys changes!

**Manual**:
1. Go to Vercel dashboard → Your project
2. Go to **"Deployments"**
3. Click **"..."** on any deployment → **"Redeploy"**

---

## 💡 Why Render + Vercel?

### Render Benefits (Backend):
- ✅ **Free tier available** (750 hours/month)
- ✅ **Easy Node.js deployment**
- ✅ **Automatic SSL**
- ✅ **Simple environment variables**
- ✅ **Great for APIs**
- ⚠️ **Note**: Free tier sleeps after 15 min inactivity (~30s cold start)

### Vercel Benefits (Frontend):
- ✅ **100GB bandwidth/month free**
- ✅ **Global CDN** - lightning fast
- ✅ **Zero configuration**
- ✅ **Instant cache invalidation**
- ✅ **Perfect for React/Vite**
- ✅ **No cold starts**

### Best Combination:
- Separate concerns (frontend/backend)
- Scale independently
- Use best platform for each part
- Free tier generous enough for production

---

## 💰 Cost Breakdown

### Render Free Tier:
- **750 hours/month** (enough for 1 service 24/7)
- Sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds

**To prevent sleep**: Use a service like [UptimeRobot](https://uptimerobot.com) (free) to ping your backend every 14 minutes.

### Vercel Free Tier:
- **100GB bandwidth/month**
- **Unlimited deployments**
- No cold starts
- Perfect for personal projects

### MongoDB Atlas Free Tier:
- **512MB storage**
- Shared cluster
- Perfect for small apps

**Total Cost**: $0/month (completely free!)

---

## 🔧 Managing Environment Variables

### Render (Backend):

1. Dashboard → Your service → **"Environment"** tab
2. Add/Edit/Remove variables
3. Click **"Save Changes"**
4. Service auto-redeploys

### Vercel (Frontend):

1. Dashboard → Your project → **"Settings"** → **"Environment Variables"**
2. Add/Edit/Remove variables
3. Must **redeploy** for changes to take effect

---

## 🐛 Troubleshooting

### Backend Issues (Render)

**Problem**: Render build fails

**Solution**:
- Check **"Logs"** tab for error messages
- Verify `Shop/backend` is the root directory
- Check `package.json` has `"start": "node server.js"`
- Ensure all dependencies are listed

**Problem**: MongoDB connection error

**Solution**:
- Verify `MONGO_URI` is correct (check for typos)
- Confirm MongoDB Atlas allows IP `0.0.0.0/0`
- Check password doesn't have special characters (URL encode if needed)
- Test connection string locally first

**Problem**: Backend sleeps / slow first request

**Solution**:
- This is normal for free tier (15 min inactivity → sleep)
- First request takes ~30 seconds to wake up
- Use UptimeRobot to keep it awake (ping every 14 min)
- Or upgrade to paid tier ($7/month) for always-on

**Problem**: CORS error

**Solution**:
- Check `FRONTEND_URL` in Render environment variables
- Must match Vercel URL exactly (no trailing slash)
- Redeploy after adding variable

### Frontend Issues (Vercel)

**Problem**: API calls fail / 404 errors

**Solution**:
- Verify `VITE_API_URL` ends with `/api`
- Check Render backend URL is correct
- Confirm Render service is running (green "Live" status)
- Test backend URL directly in browser

**Problem**: Build failed on Vercel

**Solution**:
- Check build logs in **"Deployments"** → Click deployment
- Verify root directory is `Shop/frontend`
- Check all dependencies in `package.json`
- Test build locally: `npm run build`

**Problem**: Environment variables not working

**Solution**:
- Variable names MUST start with `VITE_`
- Redeploy after adding/changing variables
- Check spelling and case sensitivity

**Problem**: Changes not showing

**Solution**:
- Clear browser cache
- Check deployment succeeded in dashboard
- Verify you pushed to correct branch (`main`)

---

## 📱 Your Live URLs

After successful deployment:

- **Customer App**: `https://ayora-food-shop.vercel.app`
- **Admin Panel**: `https://ayora-food-shop.vercel.app/login`
- **Backend API**: `https://ayora-food-backend.onrender.com`
- **API Test**: Visit backend URL to see welcome message

---

## 🔒 Security Checklist

- [ ] MongoDB Atlas password is strong and secure
- [ ] MongoDB allows IP `0.0.0.0/0` for serverless functions
- [ ] `JWT_SECRET` is long and random (32+ characters)
- [ ] Changed default admin password after first login
- [ ] `.env` files are in `.gitignore`
- [ ] Never committed environment variables to Git
- [ ] CORS configured with specific frontend URL
- [ ] All API endpoints properly authenticated

---

## 📊 Monitoring Your App

### Render:
- **Metrics**: Service dashboard shows CPU, memory usage
- **Logs**: Real-time logs in "Logs" tab
- **Events**: Deployment history and status

### Vercel:
- **Analytics**: Project → "Analytics" for page views
- **Deployments**: Track all deployments and status
- **Logs**: Click any deployment to view build logs
- **Speed Insights**: Monitor performance

---

## 🎯 Production Tips

### Keep Backend Awake:
1. Sign up for [UptimeRobot](https://uptimerobot.com) (free)
2. Add your Render backend URL as monitor
3. Set interval to 14 minutes
4. Backend stays awake 24/7!

### Custom Domains (Optional):

**Vercel**:
1. Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL automatic

**Render**:
1. Service → Settings → Custom Domain
2. Add domain and configure DNS
3. SSL automatic

---

## 🎉 Congratulations!

Your Ayora Food Shop is now live with:
- ✅ Reliable backend on Render
- ✅ Lightning-fast frontend on Vercel
- ✅ Global CDN distribution
- ✅ Automatic HTTPS everywhere
- ✅ Professional hosting
- ✅ Completely FREE!

**Share your app with the world!** 🌍

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Render Community**: https://community.render.com
- **Vercel Discussions**: https://github.com/vercel/vercel/discussions

---

## 📝 Quick Reference

### Your Environment Variables:

**Render (Backend)**:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=ayora_food_jwt_secret_2024...
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

**Vercel (Frontend)**:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Important URLs:
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
