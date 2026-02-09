# Agrova Deployment Guide

## Overview
Deploy your MERN stack application to production in 3 steps:
1. MongoDB Atlas (Database)
2. Render/Railway (Backend API)
3. Vercel/Netlify (Frontend)

---

## Step 1: Deploy Database (MongoDB Atlas)

### Setup MongoDB Atlas (FREE)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google or email

2. **Create Cluster**
   - Click "Build a Database" → Select FREE M0 tier
   - Choose cloud provider: AWS
   - Choose region: Closest to your users (e.g., Mumbai for India)
   - Cluster name: `agrova-cluster`

3. **Create Database User**
   - Security → Database Access → Add New Database User
   - Username: `agrova_admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: `Read and write to any database`

4. **Configure Network Access**
   - Security → Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to your server IPs only

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string (looks like):
   ```
   mongodb+srv://agrova_admin:<password>@agrova-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `agrova` at the end before `?`
   ```
   mongodb+srv://agrova_admin:YOUR_PASSWORD@agrova-cluster.xxxxx.mongodb.net/agrova?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend (Render - FREE)

### Option A: Render (Recommended)

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub (connects to GHOST-031 account)

2. **Create Web Service**
   - Dashboard → New + → Web Service
   - Connect to GitHub repository: `GHOST-031/Agrova`
   - Configure:
     - **Name**: `agrova-backend`
     - **Region**: Singapore (closest to India)
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Instance Type**: Free

3. **Add Environment Variables**
   Click "Advanced" → Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=mongodb+srv://agrova_admin:YOUR_PASSWORD@agrova-cluster.xxxxx.mongodb.net/agrova?retryWrites=true&w=majority
   JWT_SECRET=oG9vroo5QQW607zpgGXbBA0c0MPWp/Hvpr0Twe3d7CU=
   FRONTEND_URL=https://agrova.vercel.app
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your backend URL: `https://agrova-backend.onrender.com`

5. **Important: Keep Backend Awake**
   - Free tier sleeps after 15min inactivity
   - Use cron job or UptimeRobot to ping every 10min
   - Or upgrade to paid plan ($7/month)

---

## Step 3: Deploy Frontend (Vercel - FREE)

### Setup Vercel

1. **Create Account**
   - Go to https://vercel.com
   - Sign up with GitHub (GHOST-031)

2. **Import Project**
   - Dashboard → Add New → Project
   - Import Git Repository: `GHOST-031/Agrova`
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `./` (leave as root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables**
   - Settings → Environment Variables
   ```
   VITE_API_URL=https://agrova-backend.onrender.com
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site: `https://agrova.vercel.app`

5. **Custom Domain (Optional)**
   - Settings → Domains
   - Add your custom domain (e.g., agrova.com)
   - Update DNS records as instructed

---

## Step 4: Configure Frontend to Use Backend API

### Update API Configuration

Before deploying, update your frontend to use production backend:

**File: `src/utils/api.js`**

Add environment variable support:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Use this instead of hardcoded localhost
```

---

## Step 5: Seed Database with Demo Data

After backend is deployed, seed the database:

```bash
# Install MongoDB Compass or use MongoDB Atlas UI
# Connect to your cluster
# Or run seed script locally:

cd backend
# Update .env with Atlas connection string
node seedDemoData.js
node seedProducts.js
```

---

## Alternative: Deploy Everything to Railway

Railway allows deploying full stack in one place:

1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub repo
4. Select `GHOST-031/Agrova`
5. Railway auto-detects Node.js and builds both frontend/backend
6. Add MongoDB plugin (built-in)
7. Configure environment variables
8. Deploy (one-click)

**Cost**: Free tier includes $5/month credit

---

## Cost Summary

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| **MongoDB Atlas** | 512MB storage | $57/month (2GB) |
| **Render Backend** | 750 hours/month (sleeps) | $7/month (always on) |
| **Vercel Frontend** | Unlimited bandwidth | $20/month (Pro) |
| **Railway (All-in-one)** | $5 credit/month | $20/month |

**Total Free**: $0/month (with limitations)
**Total Paid**: ~$84/month (fully production-ready)
**Railway Option**: $20/month (good middle ground)

---

## Post-Deployment Checklist

- [ ] Test login with demo users
- [ ] Test product browsing
- [ ] Test cart and checkout
- [ ] Test location services
- [ ] Test language switching
- [ ] Configure Razorpay with real keys
- [ ] Set up SSL certificate (auto with Vercel/Render)
- [ ] Configure CORS to only allow your frontend domain
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure custom domain
- [ ] Update environment variables with production values

---

## Environment Variables Needed

### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=oG9vroo5QQW607zpgGXbBA0c0MPWp/Hvpr0Twe3d7CU=
FRONTEND_URL=https://agrova.vercel.app
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
```

### Frontend (.env.production)
```env
VITE_API_URL=https://agrova-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_...
```

---

## Troubleshooting

### Backend not responding
- Check Render logs: Dashboard → agrova-backend → Logs
- Verify environment variables are set
- Check MongoDB connection string

### CORS errors
- Update FRONTEND_URL in backend .env
- Restart backend service

### Frontend can't connect to backend
- Verify VITE_API_URL is set correctly
- Check backend is running (visit API URL in browser)
- Check browser console for errors

### Database connection failed
- Verify MongoDB Atlas connection string
- Check network access allows 0.0.0.0/0
- Verify database user credentials

---

## Next Steps

1. **Get Razorpay Production Keys**
   - Go to https://dashboard.razorpay.com
   - Complete KYC verification
   - Get live API keys (replace test keys)

2. **Set Up Monitoring**
   - Sentry for error tracking
   - Google Analytics for user analytics
   - UptimeRobot for uptime monitoring

3. **Performance Optimization**
   - Enable CDN for static assets
   - Configure image optimization
   - Set up caching headers

4. **Security Hardening**
   - Restrict MongoDB network access to backend IPs only
   - Enable rate limiting (already implemented)
   - Set up WAF (Web Application Firewall)
   - Regular security audits

Your app will be live at:
- **Frontend**: https://agrova.vercel.app
- **Backend API**: https://agrova-backend.onrender.com/api
- **Admin Login**: https://agrova.vercel.app/login

Demo Credentials:
- Consumer: vermakrishansh@gmail.com / consumer123
- Farmer: vermaashwani@hotmail.com / farmer123
