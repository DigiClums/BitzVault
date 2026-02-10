# BitzVault Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
1. GitHub account
2. Vercel account (free at vercel.com)
3. MongoDB Atlas account (free at mongodb.com/cloud/atlas)

### Step 1: Setup MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/bitzvault`)
5. Replace `<password>` with your database password

### Step 2: Push to GitHub

```bash
cd /Users/apple/Documents/BitzVault
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Import your GitHub repository
4. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any random secure string (e.g., `abc123xyz789secure`)
   - `PORT` = 3001
5. Click "Deploy"

### Step 4: Update Frontend API URLs

After deployment, update `frontend/api.js` to use your Vercel URL instead of localhost.

---

## Alternative: Manual VPS Deployment

### Requirements
- Ubuntu/Linux VPS
- Node.js 14+
- MongoDB installed
- Domain name (optional)

### Steps

```bash
# 1. Clone repository
git clone YOUR_REPO_URL
cd BitzVault

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Setup environment
cp .env.example backend/.env
nano backend/.env  # Edit with your values

# 4. Install PM2 (process manager)
npm install -g pm2

# 5. Start backend
cd backend
pm2 start server.js --name bitzvault-backend

# 6. Start frontend
cd ../frontend
pm2 start "npx http-server -p 3000" --name bitzvault-frontend

# 7. Save PM2 config
pm2 save
pm2 startup
```

### Setup Nginx (Optional - for domain)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

---

## Environment Variables Needed

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend port (default: 3001)

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster created and connected
- [ ] Environment variables set in Vercel
- [ ] Backend API responding
- [ ] Frontend can connect to backend
- [ ] User registration working
- [ ] Login/logout working
- [ ] Transactions working

---

## Troubleshooting

**Backend not connecting to MongoDB:**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Verify connection string format
- Check database user permissions

**Frontend can't reach backend:**
- Update API_BASE_URL in frontend/api.js
- Check CORS settings in backend/server.js
- Verify Vercel routes in vercel.json

**Build fails:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check for syntax errors in code
