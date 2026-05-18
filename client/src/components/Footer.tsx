import { Hotel, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-6 h-6 text-primary-500" />
              <span className="text-lg font-bold text-white">HotelBook</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Find and book the perfect hotel for your next trip. Secure payments via M-Pesa.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/hotels" className="hover:text-white transition-colors">Browse Hotels</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">My Bookings</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} HotelBook v1.0.0. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
