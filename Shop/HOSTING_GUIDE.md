# 🚀 Ayora Food Shop - Hosting Guide

## Quick Deployment to Render.com (FREE)

### Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)

---

## Step 1: Setup MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a FREE account and cluster
3. Click "Database Access" → Add New User
   - Username: `ayorafood`
   - Password: (create a secure password)
4. Click "Network Access" → Add IP Address → `0.0.0.0/0` (allow all)
5. Click "Database" → "Connect" → "Connect your application"
6. Copy connection string (e.g., `mongodb+srv://ayorafood:password@cluster0.xxxxx.mongodb.net/`)

---

## Step 2: Push Code to GitHub

```bash
cd d:\OutSideProjects\AyoraFoodShop
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Step 3: Deploy Backend on Render

1. Go to https://render.com and sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ayora-food-backend`
   - **Root Directory**: `Shop/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Add Environment Variables**:
   ```
   MONGO_URI = (your MongoDB connection string from Step 1)
   JWT_SECRET = ayora_food_jwt_secret_2024_random_key_here
   PORT = 5000
   NODE_ENV = production
   ```

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. **Copy your backend URL** (e.g., `https://ayora-food-backend.onrender.com`)

---

## Step 4: Deploy Frontend on Render

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `ayora-food-frontend`
   - **Root Directory**: `Shop/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable**:
   ```
   VITE_API_URL = https://ayora-food-backend.onrender.com/api
   ```
   *(Replace with YOUR actual backend URL from Step 3, add `/api` at the end)*

5. Click **"Create Static Site"**
6. Wait 5-10 minutes
7. **Copy your frontend URL** (e.g., `https://ayora-food-frontend.onrender.com`)

---

## Step 5: Update Backend CORS

1. Go to your backend service on Render
2. Click **"Environment"**
3. **Add new variable**:
   ```
   FRONTEND_URL = https://ayora-food-frontend.onrender.com
   ```
   *(Use YOUR frontend URL from Step 4, NO trailing slash)*

4. Click **"Save Changes"** - The service will automatically redeploy

---

## ✅ Test Your Deployment

1. Visit your frontend URL
2. Register a new customer account
3. Test ordering food
4. Login as admin at `/login`:
   - Email: `admin@ayora.com`
   - Password: `admin123`
5. Test admin features

---

## 🔒 Important Security Steps

⚠️ **After deployment:**

1. **Change admin password** in admin dashboard
2. **Use strong JWT_SECRET** (at least 32 random characters)
3. **Never commit** `.env` files to Git
4. **Update MongoDB password** to something secure

---

## 💡 Free Tier Limitations

### Render Free Tier:
- Backend **sleeps after 15 minutes** of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month free

### To prevent cold starts:
Use https://uptimerobot.com (free) to ping your backend every 14 minutes

---

## 🐛 Common Issues

### CORS Error
**Problem**: API calls blocked by CORS policy  
**Solution**: Verify `FRONTEND_URL` in backend matches your frontend URL exactly (no trailing slash)

### API Not Found
**Problem**: 404 errors on API calls  
**Solution**: Ensure `VITE_API_URL` in frontend includes `/api` at the end

### Database Connection Failed
**Problem**: Cannot connect to MongoDB  
**Solution**: 
- Check `MONGO_URI` is correct
- Verify MongoDB Atlas allows IP `0.0.0.0/0`
- Check database user has correct permissions

### Changes Not Showing
**Problem**: Code changes don't appear  
**Solution**: 
- Push changes to GitHub (auto-deploys)
- Check Render logs for build errors
- Clear browser cache

---

## Alternative: Vercel (Frontend) + Render (Backend)

### Deploy Frontend on Vercel:

```bash
cd Shop/frontend
npm install -g vercel
vercel login
vercel
```

Set environment variable:
```bash
vercel env add VITE_API_URL production
# Enter: https://your-backend.onrender.com/api
vercel --prod
```

---

## 📱 Your Live URLs

After deployment, you'll have:

- **Customer App**: `https://ayora-food-frontend.onrender.com`
- **Admin Login**: `https://ayora-food-frontend.onrender.com/login`
- **Backend API**: `https://ayora-food-backend.onrender.com`

---

## 🆘 Need Help?

- Render Documentation: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Vercel Docs: https://vercel.com/docs

---

**🎉 Congratulations! Your app is now live and accessible worldwide!**
