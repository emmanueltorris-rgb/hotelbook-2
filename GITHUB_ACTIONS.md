# GitHub Actions Deployment Setup

This document explains how GitHub Actions automates the deployment of HotelBook to Railway.

## Workflow Overview

The `.github/workflows/deploy.yml` file contains an automated CI/CD pipeline with two main jobs:

### 1. **Test Job** (Runs on every push and PR)
- ✅ Installs dependencies
- ✅ Runs linting checks
- ✅ Executes unit tests (both server and client)
- ✅ Builds the client for production
- ✅ Uses PostgreSQL for integration tests

### 2. **Deploy Job** (Runs only on main branch push)
- ✅ Waits for test job to pass
- ✅ Deploys to Railway
- ✅ Runs database migrations
- ✅ Starts the application

## Setup Instructions

### Step 1: Add GitHub Secrets

Go to `Settings → Secrets and variables → Actions` and add:

```
RAILWAY_TOKEN
  ↳ Your Railway API token from https://railway.app/dashboard/settings?tab=tokens
```

### Step 2: Configure Railway Service

After pushing code, Railway needs to know how to build and deploy:

```bash
# In your repository root, Railway reads:
# 1. railway.json (build/deploy configuration)
# 2. package.json (dependencies and scripts)
# 3. Environment variables (from Railway dashboard)
```

### Step 3: Set Environment Variables in Railway

1. Log in to [railway.app](https://railway.app)
2. Go to your project
3. Add environment variables:

```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" >
CLIENT_URL=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_INITIATOR_PASSWORD=...
MPESA_CALLBACK_URL=https://your-railway-url.up.railway.app/api/payments/callback
```

## Workflow Files

### `.github/workflows/deploy.yml`
Main workflow that:
- Triggers on `main` branch push
- Runs tests with PostgreSQL service
- Deploys to Railway on test success

**Key sections:**
```yaml
# Test environment
services:
  postgres:  # PostgreSQL for testing
    image: postgres:15
    ports: [5432:5432]

# Build steps
- npm ci          # Install dependencies
- npm run test    # Run tests
- npm run build   # Build both server and client

# Deploy step
- railwayapp/deploy-action@v1  # Deploy to Railway
```

### `railway.json`
Railway-specific configuration:
```json
{
  "build": {
    "builder": "nixpacks"  // Automatic build detection
  },
  "deploy": {
    "startCommand": "npm run start",  // How to start the app
    "numReplicas": 1,
    "restartPolicyType": "on_failure"
  }
}
```

## Deployment Flow

```
┌─────────────────────────────────────────┐
│ Push to main branch on GitHub           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ GitHub Actions triggers                 │
│ ✓ Install dependencies                  │
│ ✓ Run tests                             │
│ ✓ Build server & client                 │
└────────────┬────────────────────────────┘
             │
             ├─ On failure: Stop & notify
             │
             ▼
┌─────────────────────────────────────────┐
│ Deploy to Railway                       │
│ ✓ Build Docker image                    │
│ ✓ Run migrations                        │
│ ✓ Start application                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Application live on                     │
│ https://hotelbook-api.up.railway.app    │
└─────────────────────────────────────────┘
```

## Monitoring Deployments

### View Workflow Runs
1. Go to GitHub repo → **Actions** tab
2. Click on workflow run to see detailed logs
3. Check each job:
   - **test** - Shows build and test output
   - **deploy** - Shows deployment logs

### Common Log Commands
```bash
# View all logs
gh run list --repo owner/hotelbook

# View specific run logs
gh run view <run-id> --log

# View logs by branch
gh run list --repo owner/hotelbook --branch main
```

### View Railway Logs
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View live logs
railway logs
```

## Troubleshooting

### Build Fails
**Error:** `Cannot find module`
**Solution:** 
```bash
# Locally verify first
npm ci
npm run build

# Check package.json dependencies
npm list
```

### Tests Fail
**Error:** `ECONNREFUSED localhost:5432`
**Solution:** Tests run with PostgreSQL service automatically, but check:
```yaml
# In workflow, ensure postgres service is running
services:
  postgres:
    image: postgres:15
    options: --health-cmd pg_isready
```

### Deployment Timeout
**Error:** `Deployment exceeded max time`
**Solution:**
- Check build logs for slow steps
- Optimize npm install: use `npm ci` instead of `npm install`
- Consider pre-building Docker images

### Environment Variables Not Set
**Error:** `DATABASE_URL is undefined`
**Solution:**
```bash
# Verify variables in Railway dashboard
railway variables list

# Set missing variable
railway variables set DATABASE_URL "postgresql://..."
```

## Advanced Configuration

### Auto-Migrations on Deploy
Add to `server/package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma migrate deploy"
  }
}
```

### Conditional Deployment
Deploy only for specific files:
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'server/**'
      - 'client/**'
      - 'package.json'
```

### Scheduled Deployments
Deploy at specific times:
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
```

### Deploy to Multiple Environments
```yaml
deploy:
  needs: test
  strategy:
    matrix:
      environment: [staging, production]
  steps:
    - uses: railwayapp/deploy-action@v1
      with:
        token: ${{ secrets[format('RAILWAY_{0}_TOKEN', matrix.environment)] }}
```

## Testing Locally

Run the build script before pushing:
```bash
chmod +x scripts/test-build.sh
./scripts/test-build.sh
```

This simulates what GitHub Actions will do.

## CI/CD Best Practices

1. ✅ Always run tests before deploying
2. ✅ Use `npm ci` instead of `npm install` (faster, more reliable)
3. ✅ Cache dependencies to speed up builds
4. ✅ Store secrets in GitHub secrets, not code
5. ✅ Use meaningful commit messages
6. ✅ Tag releases for production deployments
7. ✅ Monitor logs after each deployment
8. ✅ Set up alerts for failed builds

## Next Steps

1. **Verify workflow is running**
   - Push a commit to main
   - Check Actions tab

2. **Monitor first deployment**
   - Check GitHub Actions logs
   - Check Railway dashboard

3. **Set up monitoring**
   - Enable Railway alerts
   - Set up Slack notifications
   - Configure email alerts

4. **Document your setup**
   - Save Railway project URL
   - Document API endpoint
   - Create runbook for team

## Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Railway Deployment Guide](https://docs.railway.app)
- [Railroad GitHub Integration](https://docs.railway.app/guides/github)
