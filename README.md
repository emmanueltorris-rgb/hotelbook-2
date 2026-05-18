# HotelBook - Full-Stack Hotel Booking Platform

[![CI/CD](https://github.com/yourusername/hotelbook/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourusername/hotelbook/actions)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A modern, full-stack hotel booking application built with React 19, Express, and PostgreSQL. Features M-Pesa STK push payments, OAuth authentication, and fully responsive design.

## Features

- **React 19** with modern hooks and concurrent features
- **React Router v7** for client-side routing
- **Social Authentication** via Google & GitHub OAuth
- **M-Pesa STK Push** integration for secure mobile payments
- **PostgreSQL** database with Prisma ORM
- **TanStack Query** for server state management
- **Zustand** for client state management
- **Fully Responsive** mobile-first design with Tailwind CSS
- **CI/CD Pipeline** via GitHub Actions
- **30%+ Test Coverage** with Vitest
- **Semantic Versioning** (currently v1.0.0)

## Project Structure

```
hotelbook/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── store/         # Zustand state stores
│   │   ├── lib/           # Utilities & API client
│   │   └── test/          # Test suites
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & error handlers
│   │   ├── services/      # Business logic (M-Pesa)
│   │   └── test/          # Server tests
│   └── prisma/            # Database schema
└── .github/workflows/      # CI/CD configuration
```

## Tech Stack

### Frontend
- React 19 + TypeScript
- React Router DOM v7
- TanStack Query v5
- Zustand v5
- Tailwind CSS v3
- Lucide React Icons
- Vite v6
- Vitest + Testing Library

### Backend
- Express.js + TypeScript
- Prisma ORM + PostgreSQL
- Passport.js (Google & GitHub OAuth)
- JWT Authentication
- M-Pesa Daraja API
- Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- M-Pesa Developer Account (for payments)
- Google & GitHub OAuth Apps

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/hotelbook.git
cd hotelbook
npm install
```

### 2. Database Setup

```bash
cd server
# Copy environment variables
cp .env.example .env

# Update DATABASE_URL in .env
# DATABASE_URL="postgresql://user:password@localhost:5432/hotelbooking"

# Run migrations
npx prisma migrate dev

# Seed sample hotels
npx prisma db seed
```

### 3. Environment Configuration

#### Server (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hotelbooking"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# M-Pesa (Safaricom Daraja)
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_PASSKEY=your-mpesa-passkey
MPESA_SHORTCODE=174379
MPESA_ENVIRONMENT=sandbox
```

#### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Servers

```bash
# Run both client and server
npm run dev

# Or individually
npm run dev:client   # http://localhost:3000
npm run dev:server   # http://localhost:5000
```

## Application Flow

1. **Browse Hotels** - Search and filter hotels by location, price, and amenities
2. **View Details** - See hotel images, amenities, and availability
3. **Select Dates** - Choose check-in/check-out dates and number of guests
4. **Authentication** - Sign in with email, Google, or GitHub
5. **M-Pesa Payment** - Enter phone number and receive STK push notification
6. **Booking Confirmation** - Receive confirmation and view in dashboard

## Testing

### Client Tests
```bash
cd client
npm run test        # Watch mode
npm run test:run    # CI mode with coverage
```

### Server Tests
```bash
cd server
npm run test        # Run all tests
npm run test:watch  # Watch mode
```

### Coverage Requirements
- Lines: ≥30%
- Functions: ≥30%
- Branches: ≥30%
- Statements: ≥30%

## CI/CD Pipeline

The GitHub Actions workflow (`/.github/workflows/ci-cd.yml`) handles:

1. **Lint** - ESLint checks for both client and server
2. **Test** - Runs test suites with coverage reporting
3. **Build** - Creates production build of the client
4. **Deploy** - Auto-deploys to Vercel (client) and Render (server) on main branch merges

### Required Secrets
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `RENDER_DEPLOY_HOOK_URL`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Local registration |
| POST | `/api/auth/login` | Local login |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/github` | GitHub OAuth |
| GET | `/api/auth/me` | Get current user |

### Hotels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | List/search hotels |
| GET | `/api/hotels/:id` | Get hotel details |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking (auth) |
| GET | `/api/bookings/my` | Get user bookings (auth) |
| GET | `/api/bookings/:id` | Get booking details (auth) |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking (auth) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/stk-push` | Initiate M-Pesa STK |
| POST | `/api/payments/callback` | M-Pesa webhook |
| GET | `/api/payments/status/:id` | Check payment status |

## Deployment

### Client (Vercel)
```bash
cd client
vercel --prod
```

### Server (Render/Railway/Heroku)
1. Set environment variables in dashboard
2. Add build command: `npm run build`
3. Start command: `npm start`
4. Add PostgreSQL database

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

```bash
# Patch release (bug fixes)
npm run version:patch   # 1.0.0 → 1.0.1

# Minor release (new features)
npm run version:minor   # 1.0.0 → 1.1.0

# Major release (breaking changes)
npm run version:major   # 1.0.0 → 2.0.0
```

## Security

- JWT tokens with 7-day expiration
- Bcrypt password hashing (12 rounds)
- Helmet.js security headers
- Rate limiting (100 req/15min)
- CORS configured for specific origins
- SQL injection prevention via Prisma
- XSS protection via React escaping

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ in Kenya 🇰🇪
# hotelbook-2
