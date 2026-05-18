# 🚀 Deployment Quick Start - Railway + GitHub Actions

## ⏱️ 5 Minute Setup

### 1️⃣ Create Railway Account
Go to [railway.app](https://railway.app) and sign up

### 2️⃣ Generate Railway Token
```
Railway Dashboard → Settings → Tokens → Create Token
```

### 3️⃣ Add GitHub Secret
```
GitHub Repo Settings → Secrets and variables → Actions → New repository secret

Name: RAILWAY_TOKEN
Value: <paste token from Railway>
```

### 4️⃣ Push to GitHub
```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

### 5️⃣ Configure Railway Service

Option A (Recommended - Railway CLI):
```bash
npm install -g @railway/cli
railway login
cd /path/to/hotelbook
railway init
railway add --service postgres
railway variables set NODE_ENV=production
# ... set other variables
```

Option B (Dashboard):
1. Go to railway.app → New Project
2. Add PostgreSQL service
3. Add Node.js service
4. Link GitHub repository
5. Configure environment variables

### 6️⃣ Set Environment Variables

In Railway Dashboard, add all variables from `server/.env.example`:

**Critical Variables:**
```
NODE_ENV=production
DATABASE_URL=<auto-from postgres service>
JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" >
CLIENT_URL=<your frontend URL>
```

**OAuth Variables:**
```
GOOGLE_CLIENT_ID=<from Google Console>
GOOGLE_CLIENT_SECRET=<from Google Console>
GITHUB_CLIENT_ID=<from GitHub Settings>
GITHUB_CLIENT_SECRET=<from GitHub Settings>
```

**M-Pesa Variables:**
```
MPESA_CONSUMER_KEY=<from Safaricom>
MPESA_CONSUMER_SECRET=<from Safaricom>
MPESA_INITIATOR_PASSWORD=<from Safaricom>
MPESA_CALLBACK_URL=https://your-railway-url.up.railway.app/api/payments/callback
```

---

## 🔄 Deployment Workflow

### When you push to `main`:

```
GitHub Push
    ↓
GitHub Actions Workflow Starts
    ├─ Install Dependencies
    ├─ Run Tests
    ├─ Build Server & Client
    └─ If all pass → Deploy to Railway
          ↓
      Railway Build
          ├─ Install Production Dependencies
          ├─ Build Application
          └─ Start Server
```

### View Status:
- **GitHub**: Repo → Actions tab
- **Railway**: railway.app dashboard

---

## 📋 Checklist Before First Deployment

- [ ] GitHub repository created and pushed
- [ ] Railway account created
- [ ] Railway token generated
- [ ] GitHub secret `RAILWAY_TOKEN` added
- [ ] Railway PostgreSQL service created
- [ ] Railway Node.js service created
- [ ] GitHub repository linked to Railway
- [ ] All environment variables set in Railway
- [ ] `railway.json` exists in root directory
- [ ] Package.json scripts include `start` command
- [ ] TypeScript build works locally: `npm run build`
- [ ] Tests pass locally: `npm run test`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Deployment failed"** | Check GitHub Actions logs: Actions tab → Click workflow run |
| **"DATABASE_URL undefined"** | Verify postgres service linked in Railway, set variable in Railway dashboard |
| **"CORS error in production"** | Update CLIENT_URL in Railway environment variables |
| **"Build times out"** | Run `./scripts/test-build.sh` locally to identify slow steps |
| **"Tests failing"** | Run `npm run test` locally to debug |

---

## 🔗 Useful Links

- [GitHub Actions Docs](https://docs.github.com/actions)
- [Railway Docs](https://docs.railway.app)
- [Railway GitHub Integration](https://docs.railway.app/guides/github)
- [Prisma Deploy Migrations](https://www.prisma.io/docs/orm/prisma-migrate/production)

---

## 📊 Monitoring After Deployment

### View Logs
```bash
# Railway logs
railway logs

# GitHub workflow logs
gh run view <run-id> --log
```

### Check Application
```bash
# Visit your deployed app
https://your-railway-url.up.railway.app/api/hotels

# Should return JSON list of hotels
```

### Enable Alerts
1. Railway Dashboard → Project Settings → Notifications
2. Set up email/Slack alerts for build failures

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files
- [ ] Use GitHub Secrets for sensitive data
- [ ] Use Railway environment variables, not hardcoded
- [ ] Rotate JWT_SECRET monthly
- [ ] Keep dependencies updated: `npm audit fix`
- [ ] Enable GitHub branch protection for `main`
- [ ] Review deployed code matches git history

---

## 📈 Next Steps After Deployment

1. **Frontend Deployment** (Optional - for better performance)
   ```bash
   cd client
   npm install -g vercel
   vercel --prod
   ```

2. **Set Production Database**
   - Use Railway PostgreSQL
   - Run migrations: `railway run npm run db:migrate:deploy`

3. **Configure Custom Domain**
   - Railway Dashboard → Networking → Custom Domain

4. **Set Up Monitoring**
   - Enable Railway alerts
   - Configure error tracking (Sentry, LogRocket)

5. **Backup Plan**
   - Enable automatic backups for PostgreSQL
   - Document rollback procedure

---

## 🎯 Common Commands

```bash
# Test deployment locally
./scripts/test-build.sh

# View Railway project
railway open dashboard

# Open production logs
railway logs --tail

# Trigger redeploy
git push origin main

# Check deployment status
gh run list --branch main

# View workflow details
gh run view <run-id>
```

---

## 📞 Support

If deployment fails:
1. Check `.github/workflows/deploy.yml` for syntax
2. Review GitHub Actions logs for errors
3. Verify all environment variables are set
4. Test build locally with `./scripts/test-build.sh`
5. Check Railway logs: `railway logs`

---

**Ready?** Push to `main` and watch your app deploy! 🚀
