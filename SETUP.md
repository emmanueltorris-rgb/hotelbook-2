# 🚀 Quick Start Guide

## Prerequisites
- Node.js 20+ installed
- PostgreSQL 14+ running locally
- Git installed

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd hotelbook
npm install
```

### 2. Setup Database
```bash
cd server
cp .env.example .env
# Edit .env and set your DATABASE_URL

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Setup OAuth Apps

**Google OAuth:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Copy Client ID and Secret to server `.env`

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Secret to server `.env`

### 4. Setup M-Pesa (Optional for local dev)
1. Register at https://developer.safaricom.co.ke/
2. Create an app and get Consumer Key & Secret
3. Get Passkey from your M-Pesa account
4. Add to server `.env`

### 5. Run the App
```bash
# From root directory
npm run dev

# Client: http://localhost:3000
# Server: http://localhost:5000
```

### 6. Run Tests
```bash
# Client tests
cd client && npm run test:run

# Server tests
cd server && npm run test
```

## 📋 Checklist

- [ ] Node.js 20+ installed
- [ ] PostgreSQL running
- [ ] Database created and migrated
- [ ] Hotels seeded
- [ ] OAuth credentials configured
- [ ] M-Pesa credentials configured (for payments)
- [ ] Client .env configured
- [ ] Server .env configured
- [ ] Dependencies installed
- [ ] App running locally

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000 or 5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

**Database connection error:**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format: `postgresql://USER:PASSWORD@HOST:PORT/DBNAME`

**OAuth redirect errors:**
- Ensure redirect URIs match exactly in OAuth app settings
- Check CLIENT_URL in server .env matches your frontend URL

**M-Pesa sandbox not working:**
- Use test credentials from Safaricom Developer Portal
- Ensure phone number format is correct: 2547XXXXXXXX
- Check MPESA_ENVIRONMENT is set to 'sandbox'
