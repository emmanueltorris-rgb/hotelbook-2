import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell, Waves, Filter } from 'lucide-react'
import { useState } from 'react'
import api from '../lib/api'
import { formatPrice } from '../lib/utils'

interface Hotel {
  id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  amenities: string[]
  description: string
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
  'Restaurant': <Coffee className="w-4 h-4" />,
  'Gym': <Dumbbell className="w-4 h-4" />,
  'Pool': <Waves className="w-4 h-4" />,
}

export default function HotelsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { data: hotels, isLoading } = useQuery({
    queryKey: ['hotels', query],
    queryFn: async () => {
      const { data } = await api.get(`/hotels?search=${encodeURIComponent(query)}`)
      return data as Hotel[]
    },
  })

  const filteredHotels = hotels?.filter((hotel) => {
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(a => hotel.amenities.includes(a))
    return matchesPrice && matchesAmenities
  })

  const amenities = ['WiFi', 'Parking', 'Restaurant', 'Gym', 'Pool']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filters
              </h2>
              <button 
                className="lg:hidden text-gray-500"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>KES 0</span>
                  <span>KES {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Amenities</h3>
              <div className="space-y-2">
                {amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAmenities([...selectedAmenities, amenity])
                        } else {
                          setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {query ? `Results for "${query}"` : 'All Hotels'}
            </h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHotels?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No hotels found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHotels?.map((hotel) => (
                <Link
                  key={hotel.id}
                  to={`/hotels/${hotel.id}`}
                  className="card flex flex-col sm:flex-row gap-4 p-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full sm:w-48 h-48 sm:h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" /> {hotel.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-primary-600 fill-primary-600" />
                        <span className="text-sm font-semibold text-primary-700">{hotel.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-3 text-gray-500">
                        {hotel.amenities.slice(0, 3).map((a) => (
                          <span key={a} className="flex items-center gap-1 text-sm" title={a}>
                            {amenityIcons[a] || null}
                          </span>
                        ))}
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-gray-900">{formatPrice(hotel.price)}</span>
                        <span className="text-gray-500 text-sm">/night</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
