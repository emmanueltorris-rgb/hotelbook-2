import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// Create booking
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { hotelId, checkIn, checkOut, guests, totalAmount, phoneNumber } = req.body
    const userId = req.user!.id

    // Check room availability
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } })
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' })
    }

    const existingBookings = await prisma.booking.count({
      where: {
        hotelId,
        status: { not: 'cancelled' },
        OR: [
          {
            checkIn: { lte: new Date(checkOut) },
            checkOut: { gte: new Date(checkIn) },
          },
        ],
      },
    })

    if (existingBookings >= hotel.rooms) {
      return res.status(400).json({ message: 'No rooms available for selected dates' })
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        hotelId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: parseInt(guests),
        totalAmount: parseInt(totalAmount),
        phoneNumber,
        status: 'pending',
        paymentStatus: 'pending',
      },
      include: { hotel: true },
    })

    res.status(201).json(booking)
  } catch (err) {
    next(err)
  }
})

// Get user's bookings
router.get('/my', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: {
        hotel: {
          select: {
            name: true,
            location: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(bookings)
  } catch (err) {
    next(err)
  }
})

// Get single booking
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const booking = await prisma.booking.findFirst({
      where: { id, userId: req.user!.id },
      include: { hotel: true },
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json(booking)
  } catch (err) {
    next(err)
  }
})

// Cancel booking
router.patch('/:id/cancel', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const booking = await prisma.booking.updateMany({
      where: { id, userId: req.user!.id },
      data: { status: 'cancelled' },
    })

    if (booking.count === 0) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({ message: 'Booking cancelled successfully' })
  } catch (err) {
    next(err)
  }
})

export default router
