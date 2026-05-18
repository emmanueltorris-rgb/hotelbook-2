#!/bin/bash

# HotelBook Pre-Deployment Health Check
# Validates that everything is ready for deployment

set -e

echo "🏥 HotelBook Deployment Health Check"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

FAILED=0
WARNINGS=0

# Helper functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    FAILED=$((FAILED + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# 1. Check Git
echo -e "${BLUE}1. Git Configuration${NC}"
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    check_pass "Git repository initialized"
    
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$BRANCH" = "main" ]; then
        check_pass "On main branch"
    else
        check_warn "Not on main branch (current: $BRANCH)"
    fi
    
    if git remote get-url origin > /dev/null 2>&1; then
        check_pass "GitHub remote configured"
    else
        check_fail "No GitHub remote found"
    fi
else
    check_fail "Not a Git repository"
fi
echo ""

# 2. Check Node.js
echo -e "${BLUE}2. Node.js & npm${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    check_pass "Node.js installed: $NODE_VERSION"
    
    if [ "$NODE_MAJOR" -ge 18 ]; then
        check_pass "Node.js version is 18+ (required)"
    else
        check_fail "Node.js must be 18+, found: $NODE_VERSION"
    fi
else
    check_fail "Node.js not installed"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not installed"
fi
echo ""

# 3. Check Project Structure
echo -e "${BLUE}3. Project Structure${NC}"
if [ -d "server" ]; then
    check_pass "server/ directory exists"
else
    check_fail "server/ directory not found"
fi

if [ -d "client" ]; then
    check_pass "client/ directory exists"
else
    check_fail "client/ directory not found"
fi

if [ -f "package.json" ]; then
    check_pass "Root package.json exists"
else
    check_fail "Root package.json not found"
fi

if [ -f ".github/workflows/deploy.yml" ]; then
    check_pass "GitHub Actions workflow configured"
else
    check_fail "GitHub Actions workflow not found"
fi

if [ -f "railway.json" ]; then
    check_pass "Railway configuration exists"
else
    check_fail "railway.json not found"
fi
echo ""

# 4. Check Dependencies
echo -e "${BLUE}4. Dependencies${NC}"
if [ -d "node_modules" ]; then
    check_pass "Root dependencies installed"
else
    check_warn "Root node_modules not found (will be installed)"
fi

if [ -d "server/node_modules" ]; then
    check_pass "Server dependencies installed"
else
    check_warn "Server node_modules not found (will be installed)"
fi

if [ -d "client/node_modules" ]; then
    check_pass "Client dependencies installed"
else
    check_warn "Client node_modules not found (will be installed)"
fi
echo ""

# 5. Check Environment Files
echo -e "${BLUE}5. Environment Configuration${NC}"
if [ -f "server/.env" ]; then
    check_pass "server/.env exists"
    
    if grep -q "DATABASE_URL" server/.env; then
        check_pass "DATABASE_URL configured in server/.env"
    else
        check_warn "DATABASE_URL not set in server/.env"
    fi
    
    if grep -q "JWT_SECRET" server/.env; then
        check_pass "JWT_SECRET configured in server/.env"
    else
        check_warn "JWT_SECRET not set in server/.env"
    fi
else
    check_warn "server/.env not found (create from .env.example)"
fi

if [ -f "client/.env" ]; then
    check_pass "client/.env exists"
else
    check_warn "client/.env not found (create from .env.example)"
fi

if [ -f "server/.env.example" ]; then
    check_pass "server/.env.example exists"
else
    check_fail "server/.env.example not found"
fi
echo ""

# 6. Check Build Scripts
echo -e "${BLUE}6. Build Configuration${NC}"
if grep -q "\"build\"" package.json; then
    check_pass "Root build script defined"
else
    check_fail "Root build script not found"
fi

if grep -q "\"start\"" server/package.json; then
    check_pass "Server start script defined"
else
    check_fail "Server start script not found"
fi

if [ -f "server/tsconfig.json" ]; then
    check_pass "Server TypeScript config exists"
else
    check_fail "server/tsconfig.json not found"
fi

if [ -f "client/tsconfig.json" ]; then
    check_pass "Client TypeScript config exists"
else
    check_fail "client/tsconfig.json not found"
fi
echo ""

# 7. Check .gitignore
echo -e "${BLUE}7. Git Ignore Configuration${NC}"
if [ -f ".gitignore" ]; then
    check_pass ".gitignore exists"
    
    if grep -q ".env" .gitignore; then
        check_pass ".env files will be ignored"
    else
        check_warn ".env not in .gitignore (add it!)"
    fi
else
    check_warn ".gitignore not found"
fi
echo ""

# 8. Check Test Configuration
echo -e "${BLUE}8. Testing${NC}"
if [ -f "server/vitest.config.ts" ]; then
    check_pass "Server test config exists"
else
    check_warn "Server test config not found"
fi

if [ -f "client/vitest.config.ts" ]; then
    check_pass "Client test config exists"
else
    check_warn "Client test config not found"
fi
echo ""

# 9. Check Prisma
echo -e "${BLUE}9. Database (Prisma)${NC}"
if [ -f "server/prisma/schema.prisma" ]; then
    check_pass "Prisma schema exists"
    
    if grep -q "provider = \"sqlite\"" server/prisma/schema.prisma; then
        check_pass "Using SQLite (good for development)"
    elif grep -q "provider = \"postgresql\"" server/prisma/schema.prisma; then
        check_pass "Using PostgreSQL (production-ready)"
    fi
else
    check_fail "Prisma schema not found"
fi

if [ -d "server/prisma/migrations" ]; then
    check_pass "Database migrations exist"
else
    check_warn "No migrations found (run: npm run db:migrate)"
fi
echo ""

# 10. Check Documentation
echo -e "${BLUE}10. Deployment Documentation${NC}"
if [ -f "DEPLOY_QUICK_START.md" ]; then
    check_pass "Quick start guide exists"
else
    check_warn "DEPLOY_QUICK_START.md not found"
fi

if [ -f "DEPLOYMENT.md" ]; then
    check_pass "Deployment guide exists"
else
    check_warn "DEPLOYMENT.md not found"
fi

if [ -f "GITHUB_ACTIONS.md" ]; then
    check_pass "GitHub Actions documentation exists"
else
    check_warn "GITHUB_ACTIONS.md not found"
fi
echo ""

# 11. Health Check Summary
echo "=================================="
echo -e "${BLUE}Health Check Summary${NC}"
echo "=================================="
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
else
    echo -e "${RED}✗ $FAILED critical check(s) failed${NC}"
fi

if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ No warnings${NC}"
else
    echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
fi
echo ""

# Final Recommendations
if [ $FAILED -eq 0 ]; then
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. ✅ Ready to deploy!"
    echo "2. Make sure GitHub secret RAILWAY_TOKEN is set"
    echo "3. Commit changes: git add . && git commit -m 'Ready for deployment'"
    echo "4. Push to main: git push origin main"
    echo "5. Monitor at: https://github.com/YOUR_USERNAME/hotelbook/actions"
    echo ""
    echo "📚 Documentation:"
    echo "   • Quick start: cat DEPLOY_QUICK_START.md"
    echo "   • Full guide: cat DEPLOYMENT.md"
    echo "   • CI/CD details: cat GITHUB_ACTIONS.md"
else
    echo -e "${RED}⚠️  Fix the issues above before deploying!${NC}"
    echo ""
    echo "Common fixes:"
    echo "1. Install missing files: npm ci"
    echo "2. Create .env from .env.example: cp server/.env.example server/.env"
    echo "3. Run migrations: npm run db:migrate"
    echo "4. Check Node version: node --version (should be 18+)"
fi

echo ""
echo "=================================="
exit $FAILED
