import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const hotels = [
  {
    name: 'Serena Hotel Nairobi',
    location: 'Nairobi CBD',
    description: 'Experience luxury in the heart of Nairobi. The Serena Hotel offers world-class amenities, stunning city views, and exceptional service. Perfect for both business and leisure travelers.',
    price: 18500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    ]),
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant', 'Gym', 'Pool']),
    rooms: 120,
  },
  {
    name: 'Villa Rosa Kempinski',
    location: 'Westlands, Nairobi',
    description: 'A five-star luxury hotel offering elegant rooms, fine dining, and a world-class spa. Located in the upscale Westlands neighborhood with easy access to business districts.',
    price: 25000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    ]),
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant', 'Gym', 'Pool']),
    rooms: 200,
  },
  {
    name: 'Mombasa Beach Resort',
    location: 'Nyali, Mombasa',
    description: 'Paradise on the Kenyan coast. Enjoy pristine beaches, ocean views, and Swahili-inspired architecture. Perfect for a tropical getaway with family or friends.',
    price: 12000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
    ]),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Restaurant', 'Parking']),
    rooms: 80,
  },
  {
    name: 'Fairmont The Norfolk',
    location: 'Nairobi CBD',
    description: 'A historic landmark hotel since 1904. Combining colonial charm with modern luxury, The Norfolk offers an unforgettable stay in Nairobi\'s city center.',
    price: 22000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    ]),
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant', 'Gym']),
    rooms: 170,
  },
  {
    name: 'Sarova Whitesands',
    location: 'Bamburi, Mombasa',
    description: 'One of East Africa\'s finest beach resorts. Featuring multiple pools, water sports, and extensive gardens along the Indian Ocean coastline.',
    price: 15000,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    ]),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Restaurant', 'Parking', 'Gym']),
    rooms: 300,
  },
  {
    name: 'Tamarind Tree Hotel',
    location: 'Langata, Nairobi',
    description: 'A boutique hotel set in lush gardens near Nairobi National Park. Enjoy wildlife views, modern rooms, and exceptional dining experiences.',
    price: 9500,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
    ]),
    amenities: JSON.stringify(['WiFi', 'Parking', 'Restaurant', 'Pool']),
    rooms: 60,
  },
]

async function main() {
  console.log('Start seeding...')

  for (const hotel of hotels) {
    await prisma.hotel.create({
      data: hotel,
    })
  }

  console.log('Seeded 6 hotels')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
