import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../index'

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health')
      expect(response.status).toBe(200)
      expect(response.body.status).toBe('ok')
      expect(response.body.version).toBe('1.0.0')
      expect(response.body.timestamp).toBeDefined()
    })
  })

  describe('GET /api/hotels', () => {
    it('should return hotels list', async () => {
      const response = await request(app).get('/api/hotels')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('should search hotels by query', async () => {
      const response = await request(app).get('/api/hotels?search=Nairobi')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('POST /api/auth/register', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should validate credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        })

      expect(response.status).toBe(401)
    })
  })
})
