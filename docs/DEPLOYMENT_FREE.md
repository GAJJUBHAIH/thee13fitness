# Free Hosting Guide - three13 Fitness

## Frontend - GitHub Pages (Free)

### Setup GitHub Pages

1. **Go to GitHub repository settings:**
   - https://github.com/GAJJUBHAIH/thee13fitness/settings/pages

2. **Enable GitHub Pages:**
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. **Auto-Deploy with GitHub Actions:**
   - The workflow file (`.github/workflows/deploy.yml`) will automatically:
     - Build the frontend on every push to `main`
     - Deploy to GitHub Pages
   - Your site will be live at: https://gajjubhaih.github.io/thee13fitness/

### Manual Deploy (if needed)

```bash
cd frontend
npm run deploy
```

---

## Backend - Render.com (Free)

### Setup Render Deployment

1. **Sign up at:** https://render.com

2. **Create a new Web Service:**
   - Connect your GitHub repo
   - Select repository: `thee13fitness`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Plan: Free

3. **Set Environment Variables:**
   - Go to Environment in Render dashboard
   - Add all variables from `backend/.env`:
     ```
     RAZORPAY_KEY_ID=your_key
     RAZORPAY_KEY_SECRET=your_secret
     FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64
     ```

4. **Deploy:**
   - Render will auto-deploy on every push to `main`
   - Your backend will be at: `https://three13-backend.onrender.com`

### Update Frontend API URL

After backend is deployed, update the frontend `.env`:

```
VITE_PAYMENTS_API=https://three13-backend.onrender.com
```

---

## Live URLs

Once deployed:

- **Frontend:** https://gajjubhaih.github.io/thee13fitness/
- **Backend:** https://three13-backend.onrender.com
- **Payments API:** https://three13-backend.onrender.com/api/payments

---

## Important Notes

⚠️ **Free Tier Limitations:**

- Render free tier spins down after 15 mins of inactivity
- GitHub Pages has storage limits
- Razorpay rates apply

✅ **To keep Render running:** Upgrade to paid plan or add a cron job to ping the API every 10 mins
