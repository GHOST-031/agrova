# Vercel Deployment Guide - Agrova Marketplace

## ✅ Prerequisites Completed
- [x] MongoDB Atlas cluster created
- [x] Data migrated from local MongoDB to Atlas
- [x] Backend .env updated with Atlas connection string
- [x] Local testing successful

## 🚀 Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from Project Root
```bash
cd '/Users/krishanshverma/Downloads/Agrova ahh 2/Agrova_ahh'
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **agrova-marketplace** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 4: Add Environment Variables in Vercel

After deployment, go to your Vercel dashboard:
1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add the following variables (for Production, Preview, and Development):

#### Required Variables:
```
MONGODB_URI=mongodb+srv://vermakrishansh:K03112005v@agrova.cggerci.mongodb.net/agrova?retryWrites=true&w=majority

NODE_ENV=production

JWT_SECRET=oG9vroo5QQW607zpgGXbBA0c0MPWp/Hvpr0Twe3d7CU=

JWT_EXPIRE=30d

FRONTEND_URL=https://your-app.vercel.app
```

**⚠️ Important:** After adding environment variables, update `FRONTEND_URL` with your actual Vercel deployment URL.

#### Optional Variables (Add later for full features):
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@agrova.com
```

### Step 5: Update Frontend API URL

After first deployment, you need to add one environment variable for the FRONTEND:

In Vercel Dashboard → Environment Variables:
```
VITE_API_URL=https://your-app.vercel.app/api
```

Then redeploy:
```bash
vercel --prod
```

### Step 6: Redeploy with Environment Variables
```bash
vercel --prod
```

## 🎉 Your Site is Live!

Access your site at: `https://your-app.vercel.app`

## 📱 Testing Checklist

- [ ] Homepage loads
- [ ] User registration/login works
- [ ] Products display correctly
- [ ] Add to cart works
- [ ] Wishlist works
- [ ] Address management works
- [ ] Order placement works (test mode)
- [ ] Farmer dashboard shows orders
- [ ] Admin panel accessible

## 🔧 Troubleshooting

### Issue: API calls fail
**Solution:** Verify `VITE_API_URL` is set correctly in Vercel environment variables.

### Issue: 500 errors
**Solution:** Check Vercel function logs (Runtime Logs in dashboard) for backend errors.

### Issue: Database connection fails
**Solution:** 
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow from anywhere)
2. Check connection string is correct in Vercel environment variables

### Issue: CORS errors
**Solution:** Ensure `FRONTEND_URL` in Vercel matches your actual deployment URL.

## 📝 Next Steps

1. **Custom Domain:** Add your custom domain in Vercel settings
2. **Payment Gateway:** Add Razorpay/Stripe keys for live payments
3. **Email Service:** Configure email for order notifications
4. **Image Upload:** Set up Cloudinary for product images
5. **Monitoring:** Set up error tracking (Sentry, LogRocket, etc.)

## 🔐 Security Notes

- Change `JWT_SECRET` to a new random value for production
- Never commit `.env` files to git
- Keep your MongoDB Atlas credentials secure
- Enable MongoDB Atlas IP whitelist (currently allowing all for testing)
- Set up proper CORS policies for production

## 💡 Tips

- Use `vercel` for preview deployments
- Use `vercel --prod` for production deployments
- Check logs: `vercel logs <deployment-url>`
- Rollback if needed: Go to Deployments → Promote to Production
