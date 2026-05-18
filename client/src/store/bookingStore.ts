import { create } from 'zustand'

interface BookingData {
  hotelId: string
  hotelName: string
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  phoneNumber: string
}

interface BookingState {
  bookingData: BookingData | null
  setBookingData: (data: BookingData) => void
  clearBooking: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  bookingData: null,
  setBookingData: (data) => set({ bookingData: data }),
  clearBooking: () => set({ bookingData: null }),
}))
