import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { CreditCard, Phone, Calendar, Users, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import api from '../lib/api'
import { formatPrice, formatDate } from '../lib/utils'
import { useBookingStore } from '../store/bookingStore'

interface Hotel {
  id: string
  name: string
  location: string
  price: number
  image: string
}

interface BookingState {
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
}

export default function BookingPage() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { clearBooking } = useBookingStore()
  const bookingState = location.state as BookingState

  const [phoneNumber, setPhoneNumber] = useState('')
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const { data: hotel } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: async () => {
      const { data } = await api.get(`/hotels/${hotelId}`)
      return data as Hotel
    },
  })

  const stkPushMutation = useMutation({
    mutationFn: async (payload: { phoneNumber: string; amount: number; bookingId: string }) => {
      const { data } = await api.post('/payments/stk-push', payload)
      return data
    },
  })

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: {
      hotelId: string
      checkIn: string
      checkOut: string
      guests: number
      totalAmount: number
      phoneNumber: string
    }) => {
      const { data } = await api.post('/bookings', bookingData)
      return data
    },
  })

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid M-Pesa phone number')
      return
    }

    setBookingStatus('processing')
    setErrorMessage('')

    try {
      // Step 1: Create booking
      const booking = await createBookingMutation.mutateAsync({
        hotelId: hotelId!,
        checkIn: bookingState.checkIn,
        checkOut: bookingState.checkOut,
        guests: bookingState.guests,
        totalAmount: bookingState.totalPrice,
        phoneNumber,
      })

      // Step 2: Initiate STK Push
      await stkPushMutation.mutateAsync({
        phoneNumber,
        amount: bookingState.totalPrice,
        bookingId: booking.id,
      })

      setBookingStatus('success')
      clearBooking()
    } catch (error: any) {
      setBookingStatus('error')
      setErrorMessage(error.response?.data?.message || 'Payment failed. Please try again.')
    }
  }

  if (!bookingState) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">No booking information found. Please select dates first.</p>
        <button onClick={() => navigate(`/hotels/${hotelId}`)} className="btn-primary mt-4">
          Back to Hotel
        </button>
      </div>
    )
  }

  if (bookingStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-2">
          An M-Pesa payment request has been sent to your phone.
        </p>
        <p className="text-gray-600 mb-8">
          Please enter your M-Pesa PIN to complete the payment.
        </p>
        <div className="card p-6 mb-8 text-left">
          <h3 className="font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Hotel</span>
              <span className="font-medium">{hotel?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in</span>
              <span className="font-medium">{formatDate(bookingState.checkIn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out</span>
              <span className="font-medium">{formatDate(bookingState.checkOut)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests</span>
              <span className="font-medium">{bookingState.guests}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(bookingState.totalPrice)}</span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          View My Bookings
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking Details */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{formatDate(bookingState.checkIn)}</p>
                  <p className="text-sm text-gray-500">Check-in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{formatDate(bookingState.checkOut)}</p>
                  <p className="text-sm text-gray-500">Check-out</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{bookingState.guests} Guests</p>
                  <p className="text-sm text-gray-500">Room occupancy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Price Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Room rate</span>
                <span>{formatPrice(hotel?.price || 0)} x {Math.ceil((new Date(bookingState.checkOut).getTime() - new Date(bookingState.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(bookingState.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Payment
            </h2>

            <div className="bg-mpesa-green/10 border border-mpesa-green/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-mpesa-green rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-semibold text-gray-900">M-Pesa Payment</p>
                  <p className="text-sm text-gray-600">Pay securely via STK Push</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="254712345678"
                  className="input-field pl-12"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Format: 2547XXXXXXXX</p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={bookingStatus === 'processing'}
              className="w-full btn-mpesa py-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {bookingStatus === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay {formatPrice(bookingState.totalPrice)}</>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              You will receive an M-Pesa prompt on your phone to complete payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
