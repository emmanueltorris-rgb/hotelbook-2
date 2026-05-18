import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Get all hotels with search
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query

    const where = search ? {
      OR: [
        { name: { contains: search as string, mode: 'insensitive' as any } },
        { location: { contains: search as string, mode: 'insensitive' as any } },
        { description: { contains: search as string, mode: 'insensitive' as any } },
      ],
    } : {}

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    res.json(hotels)
  } catch (err) {
    next(err)
  }
})

// Get single hotel
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const hotel = await prisma.hotel.findUnique({ where: { id } })

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' })
    }

    res.json(hotel)
  } catch (err) {
    next(err)
  }
})

export default router
