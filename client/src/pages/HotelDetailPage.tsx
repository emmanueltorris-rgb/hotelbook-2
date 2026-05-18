import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell, Waves, Calendar, Users, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import { formatPrice, formatDate } from '../lib/utils'

interface Hotel {
  id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  images: string[]
  amenities: string[]
  description: string
  rooms: number
}

const amenityDetails: Record<string, { icon: React.ReactNode; label: string }> = {
  'WiFi': { icon: <Wifi className="w-5 h-5" />, label: 'Free WiFi' },
  'Parking': { icon: <Car className="w-5 h-5" />, label: 'Free Parking' },
  'Restaurant': { icon: <Coffee className="w-5 h-5" />, label: 'Restaurant' },
  'Gym': { icon: <Dumbbell className="w-5 h-5" />, label: 'Fitness Center' },
  'Pool': { icon: <Waves className="w-5 h-5" />, label: 'Swimming Pool' },
}

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const { data } = await api.get(`/hotels/${id}`)
      return data as Hotel
    },
  })

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  const totalPrice = (hotel?.price || 0) * calculateNights()

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${id}` } })
      return
    }
    if (!checkIn || !checkOut || calculateNights() <= 0) {
      alert('Please select valid dates')
      return
    }
    navigate(`/booking/${id}`, {
      state: { checkIn, checkOut, guests, totalPrice },
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-96 bg-gray-200 rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!hotel) return <div>Hotel not found</div>

  // Parse JSON strings if needed
  const images = typeof hotel.images === 'string' ? JSON.parse(hotel.images) : hotel.images || []
  const amenities = typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : hotel.amenities || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/hotels" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-5 h-5" /> Back to Hotels
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" /> {hotel.location}
          </span>
          <span className="flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
            <span className="font-semibold text-primary-700">{hotel.rating}</span>
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <img src={hotel.image} alt={hotel.name} className="w-full h-96 object-cover rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          {images?.slice(0, 4).map((img, i) => (
            <img key={i} src={img} alt={`${hotel.name} ${i + 1}`} className="w-full h-44 object-cover rounded-xl" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Details */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">About this hotel</h2>
            <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-primary-600">{amenityDetails[amenity]?.icon}</span>
                  <span className="text-gray-700">{amenityDetails[amenity]?.label || amenity}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Booking Card */}
        <div className="card p-6 h-fit sticky top-24">
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(hotel.price)}</span>
            <span className="text-gray-500">/night</span>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  className="input-field pl-10"
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  className="input-field pl-10"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  className="input-field pl-10"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {calculateNights() > 0 && (
            <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>{formatPrice(hotel.price)} x {calculateNights()} nights</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}

          <button onClick={handleBook} className="w-full btn-primary py-4">
            {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
          </button>
        </div>
      </div>
    </div>
  )
}
