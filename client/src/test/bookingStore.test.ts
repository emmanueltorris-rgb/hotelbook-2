import { describe, it, expect, beforeEach } from 'vitest'
import { useBookingStore } from '../store/bookingStore'

describe('Booking Store', () => {
  beforeEach(() => {
    useBookingStore.setState({ bookingData: null })
  })

  it('should have null initial booking data', () => {
    expect(useBookingStore.getState().bookingData).toBeNull()
  })

  it('should set booking data', () => {
    const mockBooking = {
      hotelId: '1',
      hotelName: 'Test Hotel',
      checkIn: '2024-12-25',
      checkOut: '2024-12-30',
      guests: 2,
      totalAmount: 50000,
      phoneNumber: '254712345678',
    }

    useBookingStore.getState().setBookingData(mockBooking)
    expect(useBookingStore.getState().bookingData).toEqual(mockBooking)
  })

  it('should clear booking data', () => {
    const mockBooking = {
      hotelId: '1',
      hotelName: 'Test Hotel',
      checkIn: '2024-12-25',
      checkOut: '2024-12-30',
      guests: 2,
      totalAmount: 50000,
      phoneNumber: '254712345678',
    }

    useBookingStore.getState().setBookingData(mockBooking)
    useBookingStore.getState().clearBooking()
    expect(useBookingStore.getState().bookingData).toBeNull()
  })
})
