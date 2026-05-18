import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, CreditCard, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'
import api from '../lib/api'
import { formatPrice, formatDate } from '../lib/utils'

interface Booking {
  id: string
  hotel: {
    name: string
    location: string
    image: string
  }
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed'
  createdAt: string
}

const statusConfig = {
  pending: { icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-700' },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: 'bg-red-100 text-red-700' },
}

const paymentConfig = {
  pending: { label: 'Payment Pending', color: 'text-yellow-600' },
  completed: { label: 'Paid', color: 'text-green-600' },
  failed: { label: 'Payment Failed', color: 'text-red-600' },
}

export default function DashboardPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/my')
      return data as Booking[]
    },
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {bookings?.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
          <p className="text-gray-600 mb-6">Start exploring hotels and make your first booking.</p>
          <Link to="/hotels" className="btn-primary inline-flex items-center gap-2">
            Browse Hotels <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings?.map((booking) => (
            <div key={booking.id} className="card p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={booking.hotel.image}
                  alt={booking.hotel.name}
                  className="w-full sm:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{booking.hotel.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {booking.hotel.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[booking.status].color}`}>
                        {statusConfig[booking.status].icon}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Check-in</p>
                      <p className="font-medium">{formatDate(booking.checkIn)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Check-out</p>
                      <p className="font-medium">{formatDate(booking.checkOut)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Guests</p>
                      <p className="font-medium">{booking.guests}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-medium">{formatPrice(booking.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm font-medium ${paymentConfig[booking.paymentStatus].color}`}>
                        {paymentConfig[booking.paymentStatus].label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Booked on {formatDate(booking.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
