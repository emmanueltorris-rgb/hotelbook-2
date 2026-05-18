import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Wifi, Car, Coffee } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

const api = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: hotels = [] } = useQuery({
    queryKey: ['featured-hotels'],
    queryFn: async () => {
      const res = await fetch(`${api}/hotels`)
      if (!res.ok) throw new Error('Failed to fetch hotels')
      return res.json()
    },
  })

  const featuredHotels = hotels.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop"
            alt="Luxury Hotel"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Discover top-rated hotels across Kenya. Book instantly and pay securely with M-Pesa.
          </p>
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link
              to={`/hotels?q=${encodeURIComponent(searchQuery)}`}
              className="btn-primary flex items-center justify-center gap-2 py-4"
            >
              <Search className="w-5 h-5" />
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Hotels</h2>
            <p className="text-gray-600 mt-2">Handpicked accommodations for your comfort</p>
          </div>
          <Link to="/hotels" className="text-primary-600 font-medium hover:text-primary-700">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <Link key={hotel.id} to={`/hotels/${hotel.id}`} className="card group overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {hotel.rating}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{hotel.name}</h3>
                <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {hotel.location}
                </p>
                <div className="flex items-center gap-3 text-gray-500 text-sm mb-4">
                  {hotel.amenities.includes('WiFi') && <Wifi className="w-4 h-4" />}
                  {hotel.amenities.includes('Parking') && <Car className="w-4 h-4" />}
                  {hotel.amenities.includes('Restaurant') && <Coffee className="w-4 h-4" />}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">KES {hotel.price.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">/night</span>
                  </div>
                  <span className="text-primary-600 font-medium group-hover:underline">Book Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose HotelBook</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">Find hotels by location, price, and amenities in seconds.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-mpesa-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-mpesa-green">M</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">M-Pesa Payments</h3>
              <p className="text-gray-600">Secure and instant payments via M-Pesa STK push.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">Real reviews from verified guests to help you decide.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
