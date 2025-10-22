import { Compass, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Compass className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold">Whisperwild Tours</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your gateway to unforgettable Kenyan safari adventures. We specialize in creating premium travel experiences
              that combine luxury, culture, and the breathtaking wildlife of Kenya.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors">Services</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-emerald-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-gray-400">whisperwild@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-gray-400">+254 741 060 289</span>
              </li>
              <li>
                <a
                  href="https://wa.me/254741060289"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-gray-400">Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Whisperwild Tours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
