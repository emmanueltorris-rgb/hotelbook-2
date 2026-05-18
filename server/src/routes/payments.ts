import express from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import { mpesaService } from '../services/mpesa.js'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Initiate STK Push
router.post('/stk-push', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { phoneNumber, amount, bookingId } = req.body

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: req.user!.id },
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Update booking with merchant request ID placeholder
    const result = await mpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      `HOTEL-${bookingId.slice(-6)}`,
      'Hotel Booking Payment'
    )

    // Store the merchant request ID for callback matching
    await prisma.booking.update({
      where: { id: bookingId },
      data: { mpesaReceipt: result.merchantRequestID },
    })

    res.json({
      message: 'M-Pesa STK push initiated successfully',
      checkoutRequestID: result.checkoutRequestID,
      merchantRequestID: result.merchantRequestID,
    })
  } catch (err: any) {
    next(err)
  }
})

// M-Pesa Callback (public endpoint)
router.post('/callback', async (req, res, next) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2))
    await mpesaService.processCallback(req.body)
    res.json({ ResultCode: 0, ResultDesc: 'Success' })
  } catch (err) {
    // Always return success to M-Pesa to prevent retries
    console.error('Callback processing error:', err)
    res.json({ ResultCode: 0, ResultDesc: 'Received' })
  }
})

// Query payment status
router.get('/status/:bookingId', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { bookingId } = req.params
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: req.user!.id },
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({
      paymentStatus: booking.paymentStatus,
      status: booking.status,
      mpesaReceipt: booking.mpesaReceipt,
    })
  } catch (err) {
    next(err)
  }
})

export default router
