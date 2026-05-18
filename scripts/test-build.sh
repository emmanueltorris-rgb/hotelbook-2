#!/bin/bash

# Pre-deployment Build Test
# This script verifies that the application builds successfully locally
# Run this before pushing to GitHub to catch build errors early

set -e  # Exit on error

echo "🔍 Starting pre-deployment build test..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node version
echo "${YELLOW}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v)
echo "✓ Node version: $NODE_VERSION"
echo ""

# Install dependencies
echo "${YELLOW}Installing dependencies...${NC}"
npm ci --silent
cd server && npm ci --silent && cd ..
cd client && npm ci --silent && cd ..
echo "✓ Dependencies installed"
echo ""

# Run linting
echo "${YELLOW}Running linters...${NC}"
npm run lint 2>/dev/null || {
  echo "${YELLOW}⚠ Lint warnings found (non-critical)${NC}"
}
echo ""

# Build server
echo "${YELLOW}Building server...${NC}"
cd server
npm run build
cd ..
echo "✓ Server built successfully"
echo ""

# Build client
echo "${YELLOW}Building client...${NC}"
cd client
npm run build
cd ..
echo "✓ Client built successfully"
echo ""

# Run tests
echo "${YELLOW}Running tests...${NC}"
npm run test || {
  echo "${RED}✗ Tests failed!${NC}"
  exit 1
}
echo "✓ All tests passed"
echo ""

echo "${GREEN}✓ Pre-deployment build test PASSED!${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Push changes to main branch: git push origin main"
echo "  2. GitHub Actions workflow will automatically trigger"
echo "  3. Monitor deployment at: https://github.com/YOUR_USERNAME/hotelbook/actions"
echo ""
