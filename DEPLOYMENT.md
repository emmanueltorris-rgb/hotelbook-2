# Deployment Guide - Railway

This guide covers deploying HotelBook to Railway using GitHub Actions.

## Prerequisites

1. **GitHub Repository** - Already set up and pushed
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **GitHub Secrets** - Configured in repository settings

## Step 1: Create Railway Token

1. Go to [railway.app](https://railway.app) and sign in
2. Click your profile icon → **Settings**
3. Scroll to **Tokens**
4. Click **Create Token**
5. Copy the token (keep it secret!)

## Step 2: Add GitHub Secrets

Add these secrets to your GitHub repository (`Settings → Secrets and variables → Actions`):

| Secret Name | Value | Source |
|---|---|---|
| `RAILWAY_TOKEN` | Your Railway API token | Railway Dashboard |
| `RAILWAY_API_URL` | Production API URL | After first deployment (e.g., `https://hotelbook-api.up.railway.app/api`) |

## Step 3: Configure Railway Services

### Option A: Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project in root directory
railway init

# Add PostgreSQL database service
railway add --service postgres

# Set environment variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=<from postgres service>
railway variables set JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" >
railway variables set CLIENT_URL=<your frontend URL after deployment>
railway variables set GOOGLE_CLIENT_ID=<your Google OAuth ID>
railway variables set GOOGLE_CLIENT_SECRET=<your Google OAuth secret>
railway variables set GITHUB_CLIENT_ID=<your GitHub OAuth ID>
railway variables set GITHUB_CLIENT_SECRET=<your GitHub OAuth secret>
```

### Option B: Using Railway Dashboard

1. Create a new project on Railway
2. Add PostgreSQL service
3. Add Node.js service
4. Link GitHub repository to Node.js service
5. Configure environment variables (see `.env.example` files)

## Step 4: Environment Variables Required

### Backend (.env)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
PORT=5000
JWT_SECRET=<long random string>
CLIENT_URL=https://hotelbook-frontend.vercel.app (or your frontend URL)
GOOGLE_CLIENT_ID=<from Google OAuth console>
GOOGLE_CLIENT_SECRET=<from Google OAuth console>
GITHUB_CLIENT_ID=<from GitHub OAuth console>
GITHUB_CLIENT_SECRET=<from GitHub OAuth console>
MPESA_CONSUMER_KEY=<from Safaricom>
MPESA_CONSUMER_SECRET=<from Safaricom>
MPESA_INITIATOR_PASSWORD=<from Safaricom>
MPESA_CALLBACK_URL=https://hotelbook-api.up.railway.app/api/payments/callback
```

### Frontend (.env)
```
VITE_API_URL=https://hotelbook-api.up.railway.app/api
```

## Step 5: Deploy Frontend (Vercel)

For optimal performance, deploy the frontend separately to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# In client directory
cd client
vercel --prod
```

## Step 6: Trigger GitHub Actions Workflow

1. Push changes to `main` branch
2. Go to GitHub repo → **Actions** tab
3. Workflow automatically triggers
4. Monitor build and deploy logs
5. Once complete, access app at Railway deployment URL

## Deployment Checklist

- [ ] Railway token added to GitHub secrets
- [ ] PostgreSQL service created in Railway
- [ ] All environment variables configured
- [ ] OAuth credentials set up
- [ ] M-Pesa callback URL configured
- [ ] Database migrations run on production
- [ ] Frontend built and deployed
- [ ] Backend tests passing in CI/CD

## Monitoring & Logs

### View Deployment Logs
```bash
railway logs --service hotelbook-api
```

### Database Migrations on Production
```bash
# Run via Railway CLI
railway run npm run db:migrate

# Or set up automatic migrations
# Add to package.json: "postinstall": "prisma migrate deploy"
```

## Troubleshooting

### Build Fails
- Check Node.js version matches (18.x or higher)
- Verify all dependencies in package.json
- Check for environment variable references

### Database Connection Issues
- Verify DATABASE_URL format
- Check PostgreSQL service is running in Railway
- Test connection locally first

### CORS Issues
- Ensure CLIENT_URL matches frontend deployment URL
- Check backend CORS middleware configuration
- Verify frontend environment variables

### Payment Integration Issues
- Verify M-Pesa callback URL is public
- Check authentication credentials
- Test with M-Pesa sandbox first

## Rollback

If deployment fails:
```bash
# Railway automatically keeps previous deployments
railway rollback  # Use Railway CLI to rollback
```

## Performance Optimization

1. **Enable Redis caching** - Add to Railway
2. **Database indexing** - Review Prisma schema
3. **CDN for assets** - Use Vercel for frontend
4. **Monitoring** - Set up Railway alerts
