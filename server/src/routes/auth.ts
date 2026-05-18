import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// JWT helper
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

// Passport Google Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback',
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value
      if (!email) return done(new Error('No email from Google'))

      let user = await prisma.user.findFirst({
        where: { providerId: profile.id, provider: 'google' },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || email.split('@')[0],
            avatar: profile.photos?.[0]?.value,
            provider: 'google',
            providerId: profile.id,
          },
        })
      }

      done(null, user)
    } catch (err) {
      done(err as Error)
    }
  }
))

// Passport GitHub Strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: '/api/auth/github/callback',
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`

      let user = await prisma.user.findFirst({
        where: { providerId: profile.id, provider: 'github' },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || profile.username || 'GitHub User',
            avatar: profile.photos?.[0]?.value,
            provider: 'github',
            providerId: profile.id,
          },
        })
      }

      done(null, user)
    } catch (err) {
      done(err as Error)
    }
  }
))

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

// Local Register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        provider: 'local',
      },
      select: { id: true, email: true, name: true, avatar: true, provider: true },
    })

    const token = generateToken(user.id)
    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
})

// Local Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user.id)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
      },
    })
  } catch (err) {
    next(err)
  }
})

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  res.json({ user: req.user })
})

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}))

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as any
    const token = generateToken(user.id)
    const userData = encodeURIComponent(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
    }))
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${userData}`)
  }
)

// GitHub OAuth
router.get('/github', passport.authenticate('github', {
  scope: ['user:email'],
}))

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as any
    const token = generateToken(user.id)
    const userData = encodeURIComponent(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
    }))
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${userData}`)
  }
)

export default router
